const CREDENTIAL_ASSIGNMENT_PATTERN =
  /(?:api[\s_-]?key|token|secret|password)\s*[:=]\s*["']?([^\s"']{12,})/gi;

const SECRET_PATTERNS = [
  /gh[pousr]_[A-Za-z0-9]{16,}/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  CREDENTIAL_ASSIGNMENT_PATTERN,
];

export const REQUIRED_CASE_SECTIONS = [
  "场景与问题",
  "适用角色",
  "输入资料",
  "使用能力",
  "任务描述",
  "执行步骤",
  "最终产物",
  "验收标准",
  "权限与安全边界",
  "可复现证据",
  "贡献者与核验日期",
];

function parseValue(raw) {
  const value = raw.trim();
  if (value === "[]") return [];
  if (value === "true") return true;
  if (value === "false") return false;
  return value.replace(/^["']|["']$/g, "");
}

export function parseFrontmatter(source) {
  const opening = source.match(/^---\r?\n/);
  if (!opening) {
    return { attributes: {}, body: source };
  }

  const remainder = source.slice(opening[0].length);
  const closing = remainder.match(/(?:^|\r?\n)---(?:\r?\n|$)/);
  if (!closing) {
    throw new Error("Frontmatter 未闭合");
  }

  const block = remainder.slice(0, closing.index).split(/\r?\n/);
  const attributes = {};
  let activeList = null;

  for (const line of block) {
    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && activeList) {
      if (!Array.isArray(attributes[activeList])) {
        attributes[activeList] = [];
      }
      attributes[activeList].push(parseValue(listItem[1]));
      continue;
    }

    const pair = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!pair) continue;
    const [, key, raw] = pair;
    if (raw === "") {
      attributes[key] = "";
      activeList = key;
    } else {
      attributes[key] = parseValue(raw);
      activeList = null;
    }
  }

  return {
    attributes,
    body: remainder.slice(closing.index + closing[0].length),
  };
}

export function validatePageMeta(meta) {
  const errors = [];
  for (const key of ["title", "description", "status", "verifiedAt"]) {
    if (typeof meta[key] !== "string" || meta[key].trim() === "") {
      errors.push(`缺少 Frontmatter 字段：${key}`);
    }
  }

  if (
    meta.status === "verified" &&
    (!Array.isArray(meta.sources) || meta.sources.length === 0)
  ) {
    errors.push("verified 页面必须至少包含一个来源");
  }

  if (
    meta.status &&
    !["verified", "review-needed", "community-practice"].includes(meta.status)
  ) {
    errors.push(`未知 status：${meta.status}`);
  }

  return errors;
}

export function validateCaseBody(body) {
  const headings = new Set();
  let fence = null;
  let inHtmlComment = false;

  for (const line of body.split(/\r?\n/)) {
    if (fence) {
      const closing = line.match(/^ {0,3}(`+|~+)[ \t]*$/);
      if (
        closing &&
        closing[1][0] === fence.marker &&
        closing[1].length >= fence.length
      ) {
        fence = null;
      }
      continue;
    }

    let visible = "";
    let cursor = 0;
    while (cursor < line.length) {
      if (inHtmlComment) {
        const end = line.indexOf("-->", cursor);
        if (end === -1) {
          cursor = line.length;
        } else {
          inHtmlComment = false;
          cursor = end + 3;
        }
      } else {
        const start = line.indexOf("<!--", cursor);
        if (start === -1) {
          visible += line.slice(cursor);
          cursor = line.length;
        } else {
          visible += line.slice(cursor, start);
          inHtmlComment = true;
          cursor = start + 4;
        }
      }
    }

    if (visible !== line) continue;

    const opening = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (opening) {
      fence = {
        marker: opening[1][0],
        length: opening[1].length,
      };
      continue;
    }

    if (/^(?: {4}|\t)/.test(line)) continue;

    const heading = line.match(/^ {0,3}##[ \t]+(.+?)[ \t]*$/);
    if (heading) headings.add(`## ${heading[1]}`);
  }

  return REQUIRED_CASE_SECTIONS.filter(
    (section) => !headings.has(`## ${section}`),
  ).map((section) => `案例缺少章节：${section}`);
}

export function containsSensitivePattern(source) {
  if (SECRET_PATTERNS.slice(0, -1).some((pattern) => pattern.test(source))) {
    return true;
  }

  for (const [, value] of source.matchAll(CREDENTIAL_ASSIGNMENT_PATTERN)) {
    const isPlaceholder =
      /^YOUR_[A-Z0-9_]+$/i.test(value) ||
      /^replace-with-your-[a-z0-9-]+$/i.test(value);
    if (!isPlaceholder) return true;
  }

  return false;
}
