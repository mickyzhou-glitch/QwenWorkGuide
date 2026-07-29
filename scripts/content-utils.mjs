const SECRET_PATTERNS = [
  /gh[pousr]_[A-Za-z0-9]{16,}/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:api[_-]?key|token|secret|password)\s*[:=]\s*["']?[^\s"']{12,}/i,
];

function parseValue(raw) {
  const value = raw.trim();
  if (value === "[]") return [];
  if (value === "true") return true;
  if (value === "false") return false;
  return value.replace(/^["']|["']$/g, "");
}

export function parseFrontmatter(source) {
  if (!source.startsWith("---\n")) {
    return { attributes: {}, body: source };
  }

  const end = source.indexOf("\n---\n", 4);
  if (end === -1) {
    throw new Error("Frontmatter 未闭合");
  }

  const block = source.slice(4, end).split("\n");
  const attributes = {};
  let activeList = null;

  for (const line of block) {
    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && activeList) {
      attributes[activeList].push(parseValue(listItem[1]));
      continue;
    }

    const pair = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!pair) continue;
    const [, key, raw] = pair;
    if (raw === "") {
      attributes[key] = [];
      activeList = key;
    } else {
      attributes[key] = parseValue(raw);
      activeList = null;
    }
  }

  return {
    attributes,
    body: source.slice(end + 5),
  };
}

export function validatePageMeta(meta) {
  const errors = [];
  for (const key of ["title", "description", "status", "verifiedAt"]) {
    if (!meta[key]) errors.push(`缺少 Frontmatter 字段：${key}`);
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
  return SECRET_PATTERNS.some((pattern) => pattern.test(source));
}
