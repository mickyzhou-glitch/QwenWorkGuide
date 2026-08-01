const CREDENTIAL_ASSIGNMENT_PATTERN =
  /(?:api[\s_-]?key|token|secret|password)\s*[:=]\s*["']?([^\s"']{12,})/gi;

const SECRET_PATTERNS = [
  /gh[pousr]_[A-Za-z0-9]{16,}/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  CREDENTIAL_ASSIGNMENT_PATTERN,
];

export const CLAIM_TYPES = new Set([
  "product-fact",
  "customer-result",
  "demo-example",
  "research-finding",
  "community-judgment",
  "practice-guidance",
]);

export const SOURCE_TYPES = new Set([
  "official-product",
  "regulatory-statistical",
  "first-party-disclosure",
  "customer-authorized",
  "independent-research",
  "public-demo",
  "internal-pilot",
  "community-framework",
]);

export const VERIFICATION_STATUSES = new Set([
  "verified",
  "limited",
  "editor-reviewed",
  "pending",
  "stale",
]);

const CLAIM_ID_PATTERN = /^claim-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isNullableString(value) {
  return value === null || typeof value === "string";
}

function isHttpUrl(value) {
  if (!isNonEmptyString(value)) return false;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function isIsoDate(value) {
  if (!DATE_PATTERN.test(value ?? "")) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.valueOf()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function isPublicSnapshotPath(value) {
  return (
    isNonEmptyString(value) &&
    value.startsWith("docs/public/evidence-snapshots/") &&
    !value.split("/").some((segment) => ["", ".", ".."].includes(segment))
  );
}

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

const RAW_HTML_BLOCK_TAG_PATTERN =
  /^(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)$/i;
const COMPLETE_HTML_TAG_PATTERN =
  /^ {0,3}(?:<\/[A-Za-z][A-Za-z0-9-]*[ \t]*>|<[A-Za-z][A-Za-z0-9-]*(?:[ \t]+[A-Za-z_:][A-Za-z0-9_.:-]*(?:[ \t]*=[ \t]*(?:[^ "'=<>`]+|'[^']*'|"[^"]*"))?)*[ \t]*\/?>)[ \t]*$/;

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
  let rawHtmlBlock = null;
  let inParagraph = false;

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

    if (inHtmlComment) {
      const closing = line.indexOf("-->");
      if (closing !== -1) {
        inHtmlComment = line.indexOf("<!--", closing + 3) !== -1;
      }
      continue;
    }

    if (rawHtmlBlock) {
      if (
        (rawHtmlBlock.untilBlank && line.trim() === "") ||
        (rawHtmlBlock.end && rawHtmlBlock.end.test(line))
      ) {
        rawHtmlBlock = null;
      }
      continue;
    }

    if (line.trim() === "") {
      inParagraph = false;
      continue;
    }

    const opening = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (opening) {
      inParagraph = false;
      fence = {
        marker: opening[1][0],
        length: opening[1].length,
      };
      continue;
    }

    const htmlStart = line.match(
      /^ {0,3}<(script|pre|style|textarea)(?:[ \t]|>|$)/i,
    );
    if (htmlStart) {
      inParagraph = false;
      const end = new RegExp(`</${htmlStart[1]}\\s*>`, "i");
      if (!end.test(line)) rawHtmlBlock = { end };
      continue;
    }

    const processingInstruction = line.match(/^ {0,3}<\?/);
    if (processingInstruction) {
      inParagraph = false;
      if (!/\?>/.test(line)) rawHtmlBlock = { end: /\?>/ };
      continue;
    }

    if (/^ {0,3}<!\[CDATA\[/i.test(line)) {
      inParagraph = false;
      if (!/\]\]>/.test(line)) rawHtmlBlock = { end: /\]\]>/ };
      continue;
    }

    if (/^ {0,3}<![A-Z]/.test(line)) {
      inParagraph = false;
      if (!/>/.test(line)) rawHtmlBlock = { end: />/ };
      continue;
    }

    const blockTag = line.match(/^ {0,3}<\/?([A-Za-z][A-Za-z0-9-]*)/);
    if (blockTag && RAW_HTML_BLOCK_TAG_PATTERN.test(blockTag[1])) {
      inParagraph = false;
      rawHtmlBlock = { untilBlank: true };
      continue;
    }

    if (!inParagraph && COMPLETE_HTML_TAG_PATTERN.test(line)) {
      rawHtmlBlock = { untilBlank: true };
      continue;
    }

    if (/^ {0,3}<!--/.test(line)) {
      inParagraph = false;
      inHtmlComment = !/-->/.test(line);
      continue;
    }

    let visible = "";
    let cursor = 0;
    while (cursor < line.length) {
      const start = line.indexOf("<!--", cursor);
      if (start === -1) {
        visible += line.slice(cursor);
        cursor = line.length;
      } else {
        visible += line.slice(cursor, start);
        const end = line.indexOf("-->", start + 4);
        if (end === -1) {
          inHtmlComment = true;
          cursor = line.length;
        } else {
          cursor = end + 3;
        }
      }
    }

    if (/^(?: {4}|\t)/.test(visible)) continue;

    const heading = visible.match(/^ {0,3}##[ \t]+(.+?)[ \t]*$/);
    if (heading) {
      const title = /[ \t]+#+[ \t]*$/.test(line)
        ? heading[1].replace(/[ \t]+#+[ \t]*$/, "")
        : heading[1];
      headings.add(`## ${title}`);
      inParagraph = false;
    } else if (visible.trim() !== "") {
      inParagraph = true;
    }
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

export function validateEvidenceLedger(ledger, { today }) {
  const errors = [];
  if (ledger?.schema_version !== 1) {
    errors.push("evidence-ledger: schema_version 必须为 1");
  }
  if (!Array.isArray(ledger?.claims)) {
    return [...errors, "evidence-ledger: claims 必须为数组"];
  }

  const ids = new Set();
  for (const [index, claim] of ledger.claims.entries()) {
    const label = `claims[${index}]`;
    if (claim === null || typeof claim !== "object" || Array.isArray(claim)) {
      errors.push(`${label}: 必须为对象`);
      continue;
    }

    if (!CLAIM_ID_PATTERN.test(claim?.claim_id ?? "")) {
      errors.push(`${label}: claim_id 格式错误`);
    }
    if (ids.has(claim?.claim_id)) errors.push(`${label}: claim_id 重复`);
    ids.add(claim?.claim_id);

    const isUnpublished =
      ["pending", "stale"].includes(claim?.verification_status) &&
      claim?.summary_eligible === false &&
      claim?.blocks_release === false;
    if (isUnpublished) {
      if (claim.content_path !== null || claim.content_anchor !== null) {
        errors.push(`${label}: 未发布主张的正文路径和锚点必须为 null`);
      }
    } else if (
      !isNonEmptyString(claim?.content_path) ||
      claim?.content_anchor !== claim?.claim_id
    ) {
      errors.push(
        `${label}: 已发布主张必须有正文路径，且 content_anchor 等于 claim_id`,
      );
    }
    if (
      isNonEmptyString(claim?.content_path) &&
      !/^docs\/[a-zA-Z0-9_./-]+\.md$/.test(claim.content_path)
    ) {
      errors.push(`${label}: content_path 必须是 docs/ 下的 Markdown 路径`);
    }

    if (!CLAIM_TYPES.has(claim?.claim_type)) {
      errors.push(`${label}: claim_type 枚举错误`);
    }
    if (!VERIFICATION_STATUSES.has(claim?.verification_status)) {
      errors.push(`${label}: verification_status 枚举错误`);
    }
    for (const key of ["is_key", "summary_eligible", "blocks_release"]) {
      if (typeof claim?.[key] !== "boolean") {
        errors.push(`${label}: ${key} 必须为布尔值`);
      }
    }
    if (claim?.summary_eligible && (!claim.is_key || !claim.blocks_release)) {
      errors.push(
        `${label}: summary_eligible 要求 is_key 和 blocks_release 同时为 true`,
      );
    }
    if (
      claim?.summary_eligible &&
      ["pending", "stale"].includes(claim.verification_status)
    ) {
      errors.push(`${label}: summary_eligible 不允许 pending 或 stale`);
    }
    if (
      claim?.blocks_release &&
      ["pending", "stale"].includes(claim.verification_status)
    ) {
      errors.push(`${label}: blocks_release 主张不能处于 pending 或 stale`);
    }
    if (
      claim?.verification_status === "editor-reviewed" &&
      !["community-judgment", "practice-guidance"].includes(claim.claim_type)
    ) {
      errors.push(`${label}: editor-reviewed 只适用于社区判断或实践建议`);
    }

    if (claim?.claim_type === "customer-result" && !isUnpublished) {
      const evidence = claim?.customer_evidence;
      for (const key of [
        "authorization_scope",
        "metric_definition",
        "denominator",
        "sample_period",
        "comparison_period",
        "comparison_basis",
      ]) {
        if (!isNonEmptyString(evidence?.[key])) {
          errors.push(`${label}: customer_evidence.${key} 不得为空`);
        }
      }
      if (!Number.isInteger(evidence?.sample_size) || evidence.sample_size <= 0) {
        errors.push(`${label}: customer_evidence.sample_size 必须为正整数`);
      }
      for (const key of ["sample_period", "comparison_period"]) {
        const [start, end, extra] = String(evidence?.[key] ?? "").split("/");
        if (
          extra !== undefined ||
          !isIsoDate(start) ||
          !isIsoDate(end) ||
          start > end
        ) {
          errors.push(`${label}: customer_evidence.${key} 格式错误`);
        }
      }
      for (const key of ["input_preparation", "review", "rework"]) {
        if (typeof evidence?.human_work_included?.[key] !== "boolean") {
          errors.push(
            `${label}: customer_evidence.human_work_included.${key} 必须为布尔值`,
          );
        }
      }
      if (evidence?.audit_disclosure !== "客户陈述、未经独立审计") {
        errors.push(
          `${label}: customer_evidence.audit_disclosure 必须使用固定审计说明`,
        );
      }
    } else if (
      claim?.claim_type !== "customer-result" &&
      claim?.customer_evidence !== null
    ) {
      errors.push(`${label}: 非 customer-result 的 customer_evidence 必须为 null`);
    }

    const source = claim?.source;
    const hasVerifiedSnapshot =
      isPublicSnapshotPath(source?.snapshot_path) &&
      /^sha256:[a-f0-9]{64}$/.test(source?.content_hash ?? "");
    const hasStableLocator =
      isHttpUrl(source?.deep_link) || hasVerifiedSnapshot;
    const hasLimitedFallback =
      isNonEmptyString(source?.excerpt) &&
      isIsoDate(source?.accessed_at) &&
      /^sha256:[a-f0-9]{64}$/.test(source?.content_hash ?? "");
    if (
      source?.source_type !== "community-framework" &&
      !isUnpublished &&
      !hasStableLocator &&
      !(claim?.verification_status === "limited" && hasLimitedFallback)
    ) {
      errors.push(
        `${label}: 外部来源定位不足，必须有深链/快照，或以 limited 提供摘记、日期和哈希`,
      );
    }
    if (source?.source_type === "internal-pilot" && !isUnpublished) {
      errors.push(`${label}: internal-pilot 不得直接进入公开内容`);
    }
    if (
      claim?.stale_after &&
      isIsoDate(claim.stale_after) &&
      claim.stale_after < today &&
      claim.verification_status !== "stale"
    ) {
      errors.push(`${label}: 已超过 stale_after，状态必须为 stale`);
    }
    if (!isIsoDate(claim?.last_verified_at)) {
      errors.push(`${label}: last_verified_at 日期格式错误`);
    }
    if (claim?.stale_after !== null && !isIsoDate(claim?.stale_after)) {
      errors.push(`${label}: stale_after 必须为日期或 null`);
    }
    if (
      !isNonEmptyString(claim?.claim_text) ||
      !isNonEmptyString(claim?.measurement_basis) ||
      !isNonEmptyString(claim?.applicability) ||
      !isNonEmptyString(claim?.reviewer_role)
    ) {
      errors.push(`${label}: 主张、统计口径、适用范围和责任角色不得为空`);
    }
    if (
      !source ||
      !SOURCE_TYPES.has(source.source_type) ||
      !isNonEmptyString(source.title) ||
      !isNonEmptyString(source.organization)
    ) {
      errors.push(`${label}: source 字段不完整`);
    }
    for (const key of [
      "source_ref",
      "excerpt",
      "external_record_id",
      "deep_link",
      "snapshot_path",
      "content_hash",
      "published_at",
      "accessed_at",
      "captured_at",
    ]) {
      if (!isNullableString(source?.[key])) {
        errors.push(`${label}: source.${key} 必须为字符串或 null`);
      }
    }
    if (
      source?.source_ref !== null &&
      !/^R[1-9][0-9]*$/.test(source?.source_ref ?? "")
    ) {
      errors.push(`${label}: source.source_ref 格式错误`);
    }
    for (const key of ["excerpt", "external_record_id"]) {
      if (source?.[key] !== null && !isNonEmptyString(source?.[key])) {
        errors.push(`${label}: source.${key} 必须为非空字符串或 null`);
      }
    }
    if (source?.deep_link !== null && !isHttpUrl(source?.deep_link)) {
      errors.push(`${label}: source.deep_link 必须为 HTTP(S) URL 或 null`);
    }
    if (
      source?.snapshot_path !== null &&
      !isPublicSnapshotPath(source?.snapshot_path)
    ) {
      errors.push(
        `${label}: source.snapshot_path 必须位于 docs/public/evidence-snapshots/ 且不得包含空、. 或 .. 路径段`,
      );
    }
    if (
      source?.content_hash !== null &&
      !/^sha256:[a-f0-9]{64}$/.test(source?.content_hash ?? "")
    ) {
      errors.push(`${label}: source.content_hash 格式错误`);
    }
    if (
      source?.snapshot_path !== null &&
      !/^sha256:[a-f0-9]{64}$/.test(source?.content_hash ?? "")
    ) {
      errors.push(`${label}: source.snapshot_path 要求 content_hash`);
    }
    for (const key of ["published_at", "captured_at"]) {
      if (source?.[key] !== null && !isIsoDate(source?.[key])) {
        errors.push(`${label}: source.${key} 必须为日期或 null`);
      }
    }
    if (!isIsoDate(source?.accessed_at)) {
      errors.push(`${label}: source.accessed_at 日期格式错误`);
    }
    if (
      !Array.isArray(claim?.limitations) ||
      claim.limitations.length === 0 ||
      claim.limitations.some((item) => !isNonEmptyString(item))
    ) {
      errors.push(`${label}: limitations 必须为非空字符串数组`);
    }
    if (
      !Array.isArray(claim?.conflicts) ||
      claim.conflicts.some((item) => !isNonEmptyString(item))
    ) {
      errors.push(`${label}: conflicts 必须为字符串数组`);
    }
  }
  return errors;
}
