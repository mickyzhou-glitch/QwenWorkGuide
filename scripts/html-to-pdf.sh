#!/usr/bin/env bash
set -euo pipefail

QWG_EXPLICIT_CHROME=""
QWG_WAIT_MS="3000"
QWG_CHECK_ONLY="0"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --chrome)
      [[ $# -ge 2 ]] || { echo "--chrome 缺少路径" >&2; exit 2; }
      QWG_EXPLICIT_CHROME="$2"
      shift 2
      ;;
    --wait-ms)
      [[ $# -ge 2 ]] || { echo "--wait-ms 缺少数值" >&2; exit 2; }
      QWG_WAIT_MS="$2"
      shift 2
      ;;
    --check)
      QWG_CHECK_ONLY="1"
      shift
      ;;
    --)
      shift
      break
      ;;
    -*)
      echo "未知参数：$1" >&2
      exit 2
      ;;
    *)
      break
      ;;
  esac
done

if ! [[ "$QWG_WAIT_MS" =~ ^[0-9]+$ ]]; then
  echo "--wait-ms 必须为非负整数" >&2
  exit 2
fi

resolve_chrome() {
  local candidate=""
  if [[ -n "$QWG_EXPLICIT_CHROME" ]]; then
    [[ -x "$QWG_EXPLICIT_CHROME" ]] || {
      echo "--chrome 指定的文件不可执行：$QWG_EXPLICIT_CHROME" >&2
      return 1
    }
    printf '%s\n' "$QWG_EXPLICIT_CHROME"
    return 0
  fi
  if [[ -n "${QWG_CHROME_BIN:-}" ]]; then
    [[ -x "$QWG_CHROME_BIN" ]] || {
      echo "QWG_CHROME_BIN 指定的文件不可执行：$QWG_CHROME_BIN" >&2
      return 1
    }
    printf '%s\n' "$QWG_CHROME_BIN"
    return 0
  fi
  for candidate in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium" \
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"; do
    if [[ -x "$candidate" ]]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done
  for candidate in google-chrome chromium chromium-browser microsoft-edge brave-browser; do
    if command -v "$candidate" >/dev/null 2>&1; then
      command -v "$candidate"
      return 0
    fi
  done
  return 1
}

QWG_CHROME_PATH="$(resolve_chrome)" || {
  echo "未找到可执行的 Chrome/Chromium" >&2
  exit 1
}
QWG_CHROME_VERSION="$("$QWG_CHROME_PATH" --version)" || {
  echo "无法读取 Chrome/Chromium 版本" >&2
  exit 1
}
if [[ ! "$QWG_CHROME_VERSION" =~ ([0-9]+)\. ]]; then
  echo "无法解析 Chrome/Chromium 主版本：$QWG_CHROME_VERSION" >&2
  exit 1
fi
QWG_CHROME_MAJOR="${BASH_REMATCH[1]}"
if (( QWG_CHROME_MAJOR < 131 )); then
  echo "Chrome/Chromium 主版本必须 >=131：$QWG_CHROME_VERSION" >&2
  exit 1
fi
printf '%s\n' "$QWG_CHROME_VERSION"

if [[ "$QWG_CHECK_ONLY" = "1" ]]; then
  printf 'Chrome: %s\n' "$QWG_CHROME_PATH"
  exit 0
fi

if [[ $# -ne 2 ]]; then
  echo "必须提供 INPUT_HTML 和 OUTPUT_PDF" >&2
  exit 2
fi
QWG_INPUT_HTML="$1"
QWG_OUTPUT_PDF="$2"
if [[ ! -f "$QWG_INPUT_HTML" ]]; then
  echo "输入 HTML 不是普通文件" >&2
  exit 1
fi

QWG_INPUT_ABS="$(cd "$(dirname "$QWG_INPUT_HTML")" && pwd)/$(basename "$QWG_INPUT_HTML")"
QWG_OUTPUT_DIR="$(dirname "$QWG_OUTPUT_PDF")"
mkdir -p "$QWG_OUTPUT_DIR"
QWG_OUTPUT_ABS="$(cd "$QWG_OUTPUT_DIR" && pwd)/$(basename "$QWG_OUTPUT_PDF")"
QWG_WORK_DIR="$(mktemp -d)"
QWG_STAGE_PDF="$(mktemp "$QWG_OUTPUT_DIR/.qwg-pdf.XXXXXX")"
cleanup() {
  rm -rf "$QWG_WORK_DIR"
  rm -f "$QWG_STAGE_PDF"
}
trap cleanup EXIT

QWG_INPUT_URL="$(node --input-type=module -e \
  'import { pathToFileURL } from "node:url"; console.log(pathToFileURL(process.argv[1]).href)' \
  "$QWG_INPUT_ABS")"

"$QWG_CHROME_PATH" \
  --headless=new \
  --allow-file-access-from-files \
  --run-all-compositor-stages-before-draw \
  "--virtual-time-budget=$QWG_WAIT_MS" \
  --no-pdf-header-footer \
  "--print-to-pdf=$QWG_STAGE_PDF" \
  "$QWG_INPUT_URL"

if [[ ! -s "$QWG_STAGE_PDF" ]]; then
  echo "Chrome 未生成非空 PDF" >&2
  exit 1
fi
mv -f "$QWG_STAGE_PDF" "$QWG_OUTPUT_ABS"
printf 'PDF: %s\n' "$QWG_OUTPUT_ABS"
