const CREDENTIAL_ASSIGNMENT_PATTERN =
  /(?:api[\s_-]?key|token|secret|password)\s*[:=]\s*["']?([^\s"']{12,})/i;

const SECRET_PATTERNS = [
  /gh[pousr]_[A-Za-z0-9]{16,}/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  CREDENTIAL_ASSIGNMENT_PATTERN,
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

export function containsSensitivePattern(source) {
  if (SECRET_PATTERNS.slice(0, -1).some((pattern) => pattern.test(source))) {
    return true;
  }

  const assignment = source.match(CREDENTIAL_ASSIGNMENT_PATTERN);
  if (!assignment) return false;

  const value = assignment[1];
  return !/^YOUR_[A-Z0-9_]+$/i.test(value) &&
    !/^replace-with-your-[a-z0-9-]+$/i.test(value);
}
