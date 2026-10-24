#!/usr/bin/env bash
set -euo pipefail

QWG_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
QWG_REPO_ROOT="$(cd "$QWG_SCRIPT_DIR/.." && pwd)"
cd "$QWG_REPO_ROOT"

QWG_PDF_VERSION="v2.1"
QWG_PDF_TITLE="V2.1"
QWG_MANIFEST="scripts/bluebook-v21-manifest.json"
if [[ "${1:-}" = "--current" ]]; then shift; fi
if [[ $# -gt 0 ]]; then
  echo "未知参数：$1" >&2
  exit 2
fi

require_command() {
  command -v "$1" || {
    echo "缺少必需命令：$1" >&2
    exit 1
  }
}

QWG_NODE_PATH="$(require_command node)"
QWG_NPM_PATH="$(require_command npm)"
QWG_PDFINFO_PATH="$(require_command pdfinfo)"
QWG_PDFTOPPM_PATH="$(require_command pdftoppm)"
QWG_NODE_VERSION="$(node --version)"
QWG_NODE_MAJOR="${QWG_NODE_VERSION#v}"
QWG_NODE_MAJOR="${QWG_NODE_MAJOR%%.*}"
if (( QWG_NODE_MAJOR < 20 || QWG_NODE_MAJOR >= 25 )); then
  echo "Node.js 必须满足 >=20 <25" >&2
  exit 1
fi

printf 'Node: %s %s\n' "$QWG_NODE_PATH" "$QWG_NODE_VERSION"
printf 'npm: %s %s\n' "$QWG_NPM_PATH" "$(npm --version)"
printf 'pdfinfo: %s\n' "$QWG_PDFINFO_PATH"
pdfinfo -v
printf 'pdftoppm: %s\n' "$QWG_PDFTOPPM_PATH"
pdftoppm -v

QWG_CHROME_ARGS=()
if [[ -n "${QWG_CHROME_BIN:-}" ]]; then
  QWG_CHROME_ARGS=(--chrome "$QWG_CHROME_BIN")
fi
if [[ ${#QWG_CHROME_ARGS[@]} -gt 0 ]]; then
  scripts/html-to-pdf.sh --check "${QWG_CHROME_ARGS[@]}"
else
  scripts/html-to-pdf.sh --check
fi

QWG_WORK_DIR="$(mktemp -d)"
QWG_OUTPUT_DIR="docs/public/downloads"
mkdir -p "$QWG_OUTPUT_DIR"
QWG_STAGE_PDF="$(mktemp "$QWG_OUTPUT_DIR/.qwenwork-bluebook-${QWG_PDF_VERSION}.pdf.XXXXXX")"
QWG_SUCCESS="0"
cleanup() {
  rm -f "$QWG_STAGE_PDF"
  if [[ "$QWG_SUCCESS" != "1" ]]; then
    rm -rf "$QWG_WORK_DIR"
  fi
}
trap cleanup EXIT

npm run generate:evidence
npm run generate:cases
node scripts/check-bluebook-pdf.mjs --snapshot "$QWG_WORK_DIR/sources.json"
node scripts/build-bluebook-print.mjs \
  --manifest "$QWG_MANIFEST" \
  --output "$QWG_WORK_DIR/print.html"
if [[ ${#QWG_CHROME_ARGS[@]} -gt 0 ]]; then
  scripts/html-to-pdf.sh "${QWG_CHROME_ARGS[@]}" \
    "$QWG_WORK_DIR/print.html" \
    "$QWG_WORK_DIR/bluebook.pdf"
else
  scripts/html-to-pdf.sh \
    "$QWG_WORK_DIR/print.html" \
    "$QWG_WORK_DIR/bluebook.pdf"
fi
test -s "$QWG_WORK_DIR/bluebook.pdf"

QWG_PDF_INFO="$(pdfinfo "$QWG_WORK_DIR/bluebook.pdf")"
QWG_PAGES="$(printf '%s\n' "$QWG_PDF_INFO" | awk '/^Pages:/ { print $2 }')"
QWG_TITLE="$(printf '%s\n' "$QWG_PDF_INFO" | sed -n 's/^Title:[[:space:]]*//p')"
if ! [[ "$QWG_PAGES" =~ ^[1-9][0-9]*$ ]]; then
  echo "PDF 页数无效" >&2
  exit 1
fi
if [[ "$QWG_TITLE" != *"$QWG_PDF_TITLE"* ]]; then
  echo "PDF 标题缺少 $QWG_PDF_TITLE" >&2
  exit 1
fi

mkdir -p "$QWG_WORK_DIR/pages"
pdftoppm -png -r 150 "$QWG_WORK_DIR/bluebook.pdf" "$QWG_WORK_DIR/pages/page"
QWG_RENDERED_PAGES="$(find "$QWG_WORK_DIR/pages" -type f -name 'page-*.png' | wc -l | tr -d ' ')"
if [[ "$QWG_RENDERED_PAGES" != "$QWG_PAGES" ]]; then
  echo "PNG 页数与 PDF 不一致" >&2
  exit 1
fi

cp "$QWG_WORK_DIR/bluebook.pdf" "$QWG_STAGE_PDF"
mv -f "$QWG_STAGE_PDF" "$QWG_OUTPUT_DIR/qwenwork-bluebook-${QWG_PDF_VERSION}.pdf"
node scripts/check-bluebook-pdf.mjs --capture "$QWG_WORK_DIR/sources.json"
QWG_SUCCESS="1"
printf 'PDF: %s\n' "$QWG_REPO_ROOT/$QWG_OUTPUT_DIR/qwenwork-bluebook-${QWG_PDF_VERSION}.pdf"
printf 'QA pages: %s\n' "$QWG_WORK_DIR/pages"
