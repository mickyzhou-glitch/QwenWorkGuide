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

export const BLUEBOOK_V2_PATHS = [
  "docs/bluebook/executive-summary.md",
  "docs/bluebook/part-1/01-delivery-standard.md",
  "docs/bluebook/part-1/02-task-delivery-protocol.md",
  "docs/bluebook/part-2/03-work-environment-architecture.md",
  "docs/bluebook/part-2/04-skills-connectors-expert-kits.md",
  "docs/bluebook/part-2/05-automation-boundaries.md",
  "docs/bluebook/part-3/06-office-delivery.md",
  "docs/bluebook/part-3/07-role-roadmaps.md",
  "docs/bluebook/part-3/08-research-evidence-chain.md",
  "docs/bluebook/part-3/09-public-case-atlas.md",
  "docs/bluebook/part-4/10-pilot-roadmap.md",
  "docs/bluebook/part-4/11-security-governance.md",
  "docs/bluebook/part-4/12-workflow-operations.md",
  "docs/bluebook/part-4/13-value-measurement.md",
  "docs/bluebook/conclusion-product-ecosystem.md",
  "docs/bluebook/appendices/prompt-templates.md",
  "docs/bluebook/appendices/scenario-index.md",
  "docs/bluebook/appendices/launch-checklist.md",
  "docs/bluebook/appendices/evidence-ledger.md",
  "docs/bluebook/appendices/case-source-map.md",
  "docs/bluebook/appendices/sources.md",
];

export const LEGACY_PAGE_MAP = new Map([
  [
    "docs/bluebook/part-1/01-from-answer-to-delivery.md",
    "/bluebook/part-1/01-delivery-standard",
  ],
  [
    "docs/bluebook/part-1/02-three-surfaces.md",
    "/bluebook/part-2/03-work-environment-architecture",
  ],
  [
    "docs/bluebook/part-1/03-capability-architecture.md",
    "/bluebook/part-2/03-work-environment-architecture",
  ],
  [
    "docs/bluebook/part-2/04-first-task.md",
    "/bluebook/part-1/02-task-delivery-protocol",
  ],
  [
    "docs/bluebook/part-2/05-skills-connectors-experts.md",
    "/bluebook/part-2/04-skills-connectors-expert-kits",
  ],
  [
    "docs/bluebook/part-2/06-automation.md",
    "/bluebook/part-2/05-automation-boundaries",
  ],
  [
    "docs/bluebook/part-2/13-task-delivery-protocol.md",
    "/bluebook/part-1/02-task-delivery-protocol",
  ],
  [
    "docs/bluebook/part-3/07-office-delivery.md",
    "/bluebook/part-3/06-office-delivery",
  ],
  [
    "docs/bluebook/part-3/08-role-roadmaps.md",
    "/bluebook/part-3/07-role-roadmaps",
  ],
  [
    "docs/bluebook/part-3/14-research-evidence-chain.md",
    "/bluebook/part-3/08-research-evidence-chain",
  ],
  [
    "docs/bluebook/part-3/17-public-case-atlas.md",
    "/bluebook/part-3/09-public-case-atlas",
  ],
  [
    "docs/bluebook/part-4/09-organization-rollout.md",
    "/bluebook/part-4/10-pilot-roadmap",
  ],
  [
    "docs/bluebook/part-4/10-security-governance.md",
    "/bluebook/part-4/11-security-governance",
  ],
  [
    "docs/bluebook/part-4/11-value-measurement.md",
    "/bluebook/part-4/13-value-measurement",
  ],
  [
    "docs/bluebook/part-4/12-product-ecosystem.md",
    "/bluebook/conclusion-product-ecosystem",
  ],
  [
    "docs/bluebook/part-4/15-team-workflow-operations.md",
    "/bluebook/part-4/12-workflow-operations",
  ],
  [
    "docs/bluebook/part-4/16-value-measurement-playbook.md",
    "/bluebook/part-4/13-value-measurement",
  ],
]);

export const BLUEBOOK_V2_NEXT_CHAIN = [
  [
    "docs/bluebook/executive-summary.md",
    "/bluebook/part-1/01-delivery-standard",
  ],
  [
    "docs/bluebook/part-1/01-delivery-standard.md",
    "/bluebook/part-1/02-task-delivery-protocol",
  ],
  [
    "docs/bluebook/part-1/02-task-delivery-protocol.md",
    "/bluebook/part-2/03-work-environment-architecture",
  ],
  [
    "docs/bluebook/part-2/03-work-environment-architecture.md",
    "/bluebook/part-2/04-skills-connectors-expert-kits",
  ],
  [
    "docs/bluebook/part-2/04-skills-connectors-expert-kits.md",
    "/bluebook/part-2/05-automation-boundaries",
  ],
  [
    "docs/bluebook/part-2/05-automation-boundaries.md",
    "/bluebook/part-3/06-office-delivery",
  ],
  [
    "docs/bluebook/part-3/06-office-delivery.md",
    "/bluebook/part-3/07-role-roadmaps",
  ],
  [
    "docs/bluebook/part-3/07-role-roadmaps.md",
    "/bluebook/part-3/08-research-evidence-chain",
  ],
  [
    "docs/bluebook/part-3/08-research-evidence-chain.md",
    "/bluebook/part-3/09-public-case-atlas",
  ],
  [
    "docs/bluebook/part-3/09-public-case-atlas.md",
    "/bluebook/part-4/10-pilot-roadmap",
  ],
  [
    "docs/bluebook/part-4/10-pilot-roadmap.md",
    "/bluebook/part-4/11-security-governance",
  ],
  [
    "docs/bluebook/part-4/11-security-governance.md",
    "/bluebook/part-4/12-workflow-operations",
  ],
  [
    "docs/bluebook/part-4/12-workflow-operations.md",
    "/bluebook/part-4/13-value-measurement",
  ],
  [
    "docs/bluebook/part-4/13-value-measurement.md",
    "/bluebook/conclusion-product-ecosystem",
  ],
  [
    "docs/bluebook/conclusion-product-ecosystem.md",
    "/bluebook/#附录",
  ],
];

function bluebookPathToUrl(path) {
  return `/${path.slice("docs/".length, -".md".length)}`;
}

function bluebookSidebarItem(pathIndex, text) {
  return {
    text,
    link: bluebookPathToUrl(BLUEBOOK_V2_PATHS[pathIndex]),
  };
}

export const BLUEBOOK_V2_SIDEBAR_GROUPS = [
  {
    text: "序章",
    items: [
      bluebookSidebarItem(0, "企业 AI 从功能竞赛走向工作流竞赛"),
    ],
  },
  {
    text: "第一篇：完成一次交付",
    items: [
      bluebookSidebarItem(1, "第 1 章 交付新标准"),
      bluebookSidebarItem(2, "第 2 章 任务拆解与验收"),
    ],
  },
  {
    text: "第二篇：沉淀一条工作流",
    items: [
      bluebookSidebarItem(3, "第 3 章 工作环境与能力架构"),
      bluebookSidebarItem(4, "第 4 章 Skill、连接器与专家套件"),
      bluebookSidebarItem(5, "第 5 章 自动化及其边界"),
    ],
  },
  {
    text: "第三篇：应用于专业场景",
    items: [
      bluebookSidebarItem(6, "第 6 章 办公交付"),
      bluebookSidebarItem(7, "第 7 章 岗位路线"),
      bluebookSidebarItem(8, "第 8 章 研究与证据链"),
      bluebookSidebarItem(9, "第 9 章 公开案例图谱"),
    ],
  },
  {
    text: "第四篇：扩展为组织能力",
    items: [
      bluebookSidebarItem(10, "第 10 章 场景选择与试点"),
      bluebookSidebarItem(11, "第 11 章 安全、权限与责任"),
      bluebookSidebarItem(12, "第 12 章 团队工作流运营"),
      bluebookSidebarItem(13, "第 13 章 价值度量"),
    ],
  },
  {
    text: "结语",
    items: [bluebookSidebarItem(14, "产品与生态路线建议")],
  },
  {
    text: "附录",
    items: [
      bluebookSidebarItem(15, "常用指令模板"),
      bluebookSidebarItem(16, "场景速查与评分表"),
      bluebookSidebarItem(17, "组织上线验收清单"),
      bluebookSidebarItem(18, "主张证据台账"),
      bluebookSidebarItem(19, "案例来源映射"),
      bluebookSidebarItem(20, "来源与延伸阅读"),
    ],
  },
];

export function flattenBluebookSidebar(groups) {
  return groups.flatMap((group) =>
    Array.isArray(group?.items) ? group.items : [],
  );
}

const CLAIM_ID_PATTERN = /^claim-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CASE_ID_PATTERN = /^case-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const CLAIM_MARKER_PATTERN =
  /<span id="(claim-[a-z0-9]+(?:-[a-z0-9]+)*)" data-claim-id="(claim-[a-z0-9]+(?:-[a-z0-9]+)*)"><\/span>/g;

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

function validateBluebookPageMeta(meta) {
  const errors = validatePageMeta(meta);
  if (!Array.isArray(meta.sources)) {
    errors.push("缺少 Frontmatter 字段：sources");
  }
  return errors;
}

function validateCanonicalBluebookPageMeta(meta) {
  const errors = validateBluebookPageMeta(meta);
  if (Object.hasOwn(meta, "canonical")) {
    errors.push("canonical 页面不能设置 canonical");
  }
  if (
    typeof meta.robots === "string" &&
    meta.robots
      .split(",")
      .some((directive) => directive.trim().toLowerCase() === "noindex")
  ) {
    errors.push("canonical 页面不能设置 robots: noindex");
  }
  for (const key of ["search", "prev", "next"]) {
    if (meta[key] === false) {
      errors.push(`canonical 页面不能设置 ${key}: false`);
    }
  }
  return errors;
}

function maskFencedCode(source) {
  const lines = source.split(/(?<=\n)/);
  let fence = null;
  return lines
    .map((line) => {
      const opening = line.match(/^ {0,3}(`{3,}|~{3,})/);
      if (!fence && opening) {
        fence = { marker: opening[1][0], length: opening[1].length };
        return line.replace(/[^\r\n]/g, " ");
      }
      if (fence) {
        const closing = line.match(/^ {0,3}(`+|~+)[ \t]*(?:\r?\n)?$/);
        const masked = line.replace(/[^\r\n]/g, " ");
        if (
          closing &&
          closing[1][0] === fence.marker &&
          closing[1].length >= fence.length
        ) {
          fence = null;
        }
        return masked;
      }
      return line;
    })
    .join("");
}

function inlineMarkdownLink(line) {
  const match = line.match(
    /^\[([^\[\]<>\r\n]+)\]\(([^()\s]+)\)$/,
  );
  return match === null ? null : { label: match[1], target: match[2] };
}

function markdownLinks(source) {
  return [...
    source.matchAll(
      /(?<!!)\[[^\]\r\n]+\]\(([^)\s]+)(?:\s+["'][^)]*["'])?\)/g,
    ),
  ].map((match) => ({ target: match[1], index: match.index }));
}

function hasUnsupportedLinkSyntax(source) {
  const sourceWithoutInlineTargets = source.replace(
    /(?<!!)\[[^\]\r\n]+\]\(([^)\s]+)(?:\s+["'][^)]*["'])?\)/g,
    "link",
  );
  return [
    /!\[[^\]\r\n]*\](?:\([^\r\n)]*\)|\[[^\]\r\n]*\])/,
    /(?<!!)\[[^\]\r\n]+\]\[[^\]\r\n]*\]/,
    /^[ \t]{0,3}\[[^\]\r\n]+\]:[ \t]*\S+/m,
    /<(?:https?:\/\/|mailto:)[^>\r\n]+>/i,
    /<(?:a|script)\b[^>]*>/i,
    /(?:https?:\/\/|mailto:)[^\s<>()]+/i,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  ].some((pattern) => pattern.test(sourceWithoutInlineTargets));
}

export function validateCompatibilityPage(source, expectedCanonical) {
  const errors = [];
  let parsed;
  try {
    parsed = parseFrontmatter(source);
  } catch (error) {
    return [error.message];
  }

  const { attributes, body } = parsed;
  errors.push(...validateBluebookPageMeta(attributes));
  if (attributes.canonical !== expectedCanonical) {
    errors.push(`canonical 必须为 ${expectedCanonical}`);
  }
  if (attributes.robots !== "noindex,follow") {
    errors.push("robots 必须为 noindex,follow");
  }
  for (const key of ["search", "prev", "next"]) {
    if (attributes[key] !== false) {
      errors.push(`${key} 必须为 false`);
    }
  }

  const visibleBody = body;
  const nonEmptyLines = visibleBody
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const plainH1 = /^#[ \t]+[^#<>\[\]\r\n]+$/.test(nonEmptyLines[0] ?? "");
  const links = markdownLinks(visibleBody);
  const migrationLinks = markdownLinks(nonEmptyLines[1] ?? "");
  if (
    links.length !== 1 ||
    migrationLinks.length !== 1 ||
    migrationLinks[0].target !== expectedCanonical
  ) {
    errors.push(`正文必须且只能链接到 ${expectedCanonical}`);
  }
  if (
    nonEmptyLines.length !== 2 ||
    !plainH1 ||
    migrationLinks.length !== 1 ||
    hasUnsupportedLinkSyntax(visibleBody)
  ) {
    errors.push("正文只能包含一个 H1 标题和一个迁移链接");
  }
  const prose = visibleBody.replace(/\]\([^)]+\)/g, "]");
  const wordCount = (
    prose.match(/[\p{Script=Han}]|[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/gu) ?? []
  ).length;
  if (wordCount >= 60) {
    errors.push("兼容页正文过长，疑似复制旧正文");
  }
  return errors;
}

function markdownSection(body, title) {
  const masked = maskFencedCode(body);
  const headingPattern = new RegExp(
    `^##[ \\t]+${title}[ \\t]*(?:#+[ \\t]*)?$`,
    "gm",
  );
  const headings = [...masked.matchAll(headingPattern)];
  if (headings.length === 0) return null;
  if (headings.length > 1) return { duplicate: true, source: "" };
  const [heading] = headings;
  const sectionStart = heading.index + heading[0].length;
  const remainder = masked.slice(sectionStart);
  const nextHeading = /^#{1,2}[ \t]+/m.exec(remainder);
  return {
    duplicate: false,
    source: remainder.slice(0, nextHeading?.index ?? remainder.length),
  };
}

export function validateBluebookNextChain(documents) {
  const errors = [];
  for (const [path, expected] of BLUEBOOK_V2_NEXT_CHAIN) {
    const source = documents.get(path);
    if (typeof source !== "string") {
      errors.push(`${path}: next 链源文件不存在`);
      continue;
    }
    let body;
    try {
      ({ body } = parseFrontmatter(source));
    } catch (error) {
      errors.push(`${path}: ${error.message}`);
      continue;
    }
    const section = markdownSection(body, "边界与下一步");
    if (section === null) {
      errors.push(`${path}: 缺少“边界与下一步”章节`);
      continue;
    }
    if (section.duplicate) {
      errors.push(`${path}: “边界与下一步”章节必须且只能存在一个`);
      continue;
    }
    const sectionSource = maskFencedCode(section.source);
    const nonEmptyLines = sectionSource
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const link = inlineMarkdownLink(nonEmptyLines.at(-1) ?? "");
    if (
      link === null ||
      markdownLinks(sectionSource).length !== 1 ||
      hasUnsupportedLinkSyntax(sectionSource)
    ) {
      errors.push(`${path}: “边界与下一步”必须且只能包含一个 inline 链接`);
      continue;
    }
    if (link.target !== expected) {
      errors.push(`${path}: 下一步链接必须为 ${expected}`);
    }
  }

  const bluebookHome = documents.get("docs/bluebook/index.md");
  let hasAppendixHeading = false;
  if (typeof bluebookHome === "string") {
    try {
      const { body } = parseFrontmatter(bluebookHome);
      hasAppendixHeading = /^##[ \t]+附录[ \t]*(?:#+[ \t]*)?$/m.test(
        maskFencedCode(body),
      );
    } catch {
      hasAppendixHeading = false;
    }
  }
  if (!hasAppendixHeading) {
    errors.push(
      "docs/bluebook/index.md: 缺少 /bluebook/#附录 对应的“附录”标题",
    );
  }
  return errors;
}

export function validateBluebookStructure(documents) {
  const errors = [];
  for (const path of BLUEBOOK_V2_PATHS) {
    const source = documents.get(path);
    if (typeof source !== "string") {
      errors.push(`${path}: V2 canonical 页面不存在`);
      continue;
    }
    try {
      const { attributes } = parseFrontmatter(source);
      for (const error of validateCanonicalBluebookPageMeta(attributes)) {
        errors.push(`${path}: ${error}`);
      }
    } catch (error) {
      errors.push(`${path}: ${error.message}`);
    }
  }
  for (const [path, canonical] of LEGACY_PAGE_MAP) {
    const source = documents.get(path);
    if (typeof source !== "string") {
      errors.push(`${path}: 兼容页不存在`);
      continue;
    }
    for (const error of validateCompatibilityPage(source, canonical)) {
      errors.push(`${path}: ${error}`);
    }
  }

  const expectedLinks = BLUEBOOK_V2_PATHS.map(bluebookPathToUrl);
  const actualLinks = flattenBluebookSidebar(BLUEBOOK_V2_SIDEBAR_GROUPS).map(
    (item) => item.link,
  );
  if (JSON.stringify(actualLinks) !== JSON.stringify(expectedLinks)) {
    errors.push("蓝皮书侧栏必须与 BLUEBOOK_V2_PATHS 顺序完全一致");
  }
  errors.push(...validateBluebookNextChain(documents));
  return errors;
}

export function findAuthorMarkers(source) {
  let body;
  try {
    ({ body } = parseFrontmatter(source));
  } catch {
    body = source;
  }
  const bodyOffset = source.length - body.length;
  const markers = [
    ["TO", "DO"].join(""),
    ["FIX", "ME"].join(""),
    ["T", "BD"].join(""),
    ["X", "XX"].join(""),
    ["待", "定"].join(""),
    ["待", "补"].join(""),
    ["待", "完善"].join(""),
  ];
  const english = markers.slice(0, 4).join("|");
  const chinese = markers.slice(4).join("|");
  const pattern = new RegExp(
    `\\b(?:${english})\\b|(?<!\\p{Script=Han})(?:${chinese})(?!\\p{Script=Han})`,
    "gu",
  );
  return [...body.matchAll(pattern)].map((match) => ({
    marker: match[0],
    index: bodyOffset + match.index,
  }));
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

export function validateCaseSourceMap(caseMap) {
  const errors = [];
  if (caseMap?.schema_version !== 1) {
    errors.push("case-source-map: schema_version 必须为 1");
  }
  if (!Array.isArray(caseMap?.cases)) {
    return [...errors, "case-source-map: cases 必须为数组"];
  }
  if (caseMap.cases.length !== 32) {
    errors.push("case-source-map: 必须恰好包含 32 个候选案例");
  }

  const ids = new Set();
  for (const [index, item] of caseMap.cases.entries()) {
    const label = `cases[${index}]`;
    if (item === null || typeof item !== "object" || Array.isArray(item)) {
      errors.push(`${label}: 必须为对象`);
      continue;
    }
    if (!CASE_ID_PATTERN.test(item?.case_id ?? "")) {
      errors.push(`${label}: case_id 格式错误`);
    }
    if (ids.has(item?.case_id)) errors.push(`${label}: case_id 重复`);
    ids.add(item?.case_id);
    for (const key of ["original_name", "book_category"]) {
      if (!isNonEmptyString(item?.[key])) {
        errors.push(`${label}: ${key} 不得为空`);
      }
    }
    if (!/^R[1-9][0-9]*$/.test(item?.source_ref ?? "")) {
      errors.push(`${label}: source_ref 格式错误`);
    }
    if (!isIsoDate(item?.verified_at)) {
      errors.push(`${label}: verified_at 日期格式错误`);
    }
    if (
      !Array.isArray(item?.original_tags) ||
      item.original_tags.length === 0 ||
      item.original_tags.some((value) => !isNonEmptyString(value))
    ) {
      errors.push(`${label}: original_tags 必须为非空字符串数组`);
    }
    const artifactLinks = Array.isArray(item?.artifact_links)
      ? item.artifact_links
      : [];
    if (
      !Array.isArray(item?.artifact_links) ||
      artifactLinks.some((value) => !isHttpUrl(value))
    ) {
      errors.push(`${label}: artifact_links 必须为 HTTP(S) URL 数组`);
    }
    if (
      !Array.isArray(item?.limitations) ||
      item.limitations.length === 0 ||
      item.limitations.some((value) => !isNonEmptyString(value))
    ) {
      errors.push(`${label}: limitations 必须为非空字符串数组`);
    }
    if (
      item?.external_record_id !== null &&
      !isNonEmptyString(item?.external_record_id)
    ) {
      errors.push(`${label}: external_record_id 必须为非空字符串或 null`);
    }
    if (
      item?.snapshot_path !== null &&
      !isPublicSnapshotPath(item?.snapshot_path)
    ) {
      errors.push(
        `${label}: snapshot_path 必须位于 docs/public/evidence-snapshots/ 且不得包含空、. 或 .. 路径段`,
      );
    }
    if (item?.deep_link !== null && !isHttpUrl(item?.deep_link)) {
      errors.push(`${label}: deep_link 必须为 HTTP(S) URL 或 null`);
    }
    if (
      item?.content_hash !== null &&
      !/^sha256:[a-f0-9]{64}$/.test(item?.content_hash ?? "")
    ) {
      errors.push(`${label}: content_hash 格式错误`);
    }
    if (
      item?.snapshot_path !== null &&
      !/^sha256:[a-f0-9]{64}$/.test(item?.content_hash ?? "")
    ) {
      errors.push(`${label}: snapshot_path 要求 content_hash`);
    }
    if (
      !["verified", "limited", "pending", "stale"].includes(
        item?.verification_status,
      )
    ) {
      errors.push(`${label}: verification_status 枚举错误`);
    }
    if (typeof item?.included_in_public_count !== "boolean") {
      errors.push(`${label}: included_in_public_count 必须为布尔值`);
    }
    if (item?.included_in_public_count) {
      if (!["verified", "limited"].includes(item.verification_status)) {
        errors.push(`${label}: 公开案例状态必须为 verified 或 limited`);
      }
      if (!isNonEmptyString(item.external_record_id)) {
        errors.push(`${label}: 缺少 external_record_id`);
      }
      if (item.external_record_id === item.case_id) {
        errors.push(`${label}: external_record_id 不能等于 case_id`);
      }
      if (
        !isHttpUrl(item.deep_link) &&
        !(
          isPublicSnapshotPath(item.snapshot_path) &&
          /^sha256:[a-f0-9]{64}$/.test(item.content_hash ?? "")
        )
      ) {
        errors.push(`${label}: 公开案例必须有 deep_link 或 snapshot_path`);
      }
      if (
        isNonEmptyString(item.deep_link) &&
        artifactLinks.includes(item.deep_link) &&
        !isNonEmptyString(item.snapshot_path)
      ) {
        errors.push(`${label}: 示例产物链接不能代替来源定位`);
      }
    }
  }
  return errors;
}

export function extractClaimMarkers(markdown, contentPath) {
  const markers = [];
  const errors = [];
  for (const match of markdown.matchAll(CLAIM_MARKER_PATTERN)) {
    if (match[1] !== match[2]) {
      errors.push(`${contentPath}: claim span 两个属性值不一致`);
    }
    markers.push({ claimId: match[1], contentPath });
  }
  for (const match of markdown.matchAll(/data-claim-id="([^"]+)"/g)) {
    if (!markers.some((marker) => marker.claimId === match[1])) {
      errors.push(`${contentPath}: 非标准 claim span：${match[1]}`);
    }
  }
  return { markers, errors };
}

function summaryBlocks(body) {
  const blocks = [];
  let fence = null;
  const lines = body.split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fenceMatch) {
      fence = fence ? null : fenceMatch[1][0];
      continue;
    }
    const nextLineIsTableDivider =
      /^\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)+\|?$/.test(
        lines[index + 1] ?? "",
      );
    if (
      fence ||
      line.trim() === "" ||
      /^#{1,6}\s/.test(line) ||
      /^:::/.test(line) ||
      /^\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)+\|?$/.test(line) ||
      (/^\|/.test(line) && nextLineIsTableDivider) ||
      /^\s*\[[^\]]+\]\([^)]+\)\s*$/.test(line)
    ) {
      continue;
    }
    blocks.push({ line: index + 1, source: line });
  }
  return blocks;
}

export function validateClaimReferences({
  ledger,
  documents,
  executiveSummaryPath,
}) {
  const errors = [];
  const claims = Array.isArray(ledger?.claims)
    ? ledger.claims.filter(
        (claim) =>
          claim && typeof claim === "object" && !Array.isArray(claim),
      )
    : [];
  const claimsById = new Map(claims.map((claim) => [claim.claim_id, claim]));
  const seenMarkers = new Map();
  const parsedDocuments = new Map();
  for (const [path, source] of documents) {
    let parsed;
    try {
      parsed = parseFrontmatter(source);
    } catch (error) {
      errors.push(`${path}: ${error.message}`);
      continue;
    }
    parsedDocuments.set(path, parsed);
    const extracted = extractClaimMarkers(source, path);
    errors.push(...extracted.errors);
    const pageClaims = [];
    for (const marker of extracted.markers) {
      if (!claimsById.has(marker.claimId)) {
        errors.push(`${path}: 未登记主张 ${marker.claimId}`);
      }
      if (seenMarkers.has(marker.claimId)) {
        errors.push(`${path}: 主张标记重复 ${marker.claimId}`);
      }
      seenMarkers.set(marker.claimId, path);
      const claim = claimsById.get(marker.claimId);
      if (claim) pageClaims.push(claim);
      if (
        claim &&
        ["pending", "stale"].includes(claim.verification_status)
      ) {
        errors.push(
          `${path}: pending 或 stale 主张不得出现在发布正文：${marker.claimId}`,
        );
      }
    }
    if (
      parsed.attributes.status === "verified" &&
      pageClaims.some(
        (claim) => claim.is_key && claim.verification_status !== "verified",
      )
    ) {
      errors.push(`${path}: verified 页面的关键主张必须全部为 verified`);
    }
  }
  for (const claim of claims) {
    if (claim.content_path === null) continue;
    if (!documents.has(claim.content_path)) {
      errors.push(`${claim.claim_id}: 正文路径不存在：${claim.content_path}`);
    } else if (seenMarkers.get(claim.claim_id) !== claim.content_path) {
      errors.push(`${claim.claim_id}: 正文锚点不存在或位于错误页面`);
    }
  }
  const summary = parsedDocuments.get(executiveSummaryPath);
  if (summary) {
    for (const block of summaryBlocks(summary.body)) {
      const ids = [...block.source.matchAll(CLAIM_MARKER_PATTERN)].map(
        (match) => match[1],
      );
      if (ids.length === 0) {
        errors.push(
          `${executiveSummaryPath}:${block.line}: 执行摘要未关联 claim_id`,
        );
      }
      for (const id of ids) {
        const claim = claimsById.get(id);
        if (
          claim &&
          (!claim.is_key ||
            !claim.summary_eligible ||
            !claim.blocks_release ||
            ["pending", "stale"].includes(claim.verification_status))
        ) {
          errors.push(`${id}: 不满足执行摘要发布条件`);
        }
        if (
          claim?.verification_status === "limited" &&
          !/(?:局限|限制)[:：]/.test(block.source)
        ) {
          errors.push(`${id}: limited 主张必须同块披露局限`);
        }
        if (
          claim?.verification_status === "editor-reviewed" &&
          !/本书(?:主张|建议)/.test(block.source)
        ) {
          errors.push(
            `${id}: editor-reviewed 主张必须明确写“本书主张/本书建议”`,
          );
        }
      }
    }
  }
  return errors;
}

export function normalizeSourceUrl(rawUrl) {
  const url = new URL(rawUrl);
  url.protocol = url.protocol.toLowerCase();
  url.hostname = url.hostname.toLowerCase();
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (/^(utm_|spm$)/i.test(key)) url.searchParams.delete(key);
  }
  url.pathname =
    url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
  return url.toString().replace(/\/$/, url.pathname === "/" ? "/" : "");
}

function analyzeSourceCatalog(markdown, allowedAliases) {
  const errors = [];
  const resolvedIds = new Set();
  const urls = new Map();
  const sectionPattern =
    /^##[ \t]+(R[1-9][0-9]*)[ \t]*$\n?([\s\S]*?)(?=^##[ \t]+R[1-9][0-9]*[ \t]*$|(?![\s\S]))/gm;
  const sections = [...markdown.matchAll(sectionPattern)];
  const counts = new Map();
  for (const match of sections) {
    counts.set(match[1], (counts.get(match[1]) ?? 0) + 1);
  }

  for (const [id, count] of counts) {
    if (count > 1) errors.push(`${id}: 来源 ID 重复`);
    if (allowedAliases.has(id)) {
      errors.push(`${id}: 兼容编号不得声明为 canonical 来源`);
    }
  }
  for (const match of sections) {
    const [, id, body] = match;
    if (counts.get(id) !== 1 || allowedAliases.has(id)) continue;
    const validUrls = [];
    for (const urlMatch of body.matchAll(/https?:\/\/[^\s)<>\]}]+/g)) {
      try {
        validUrls.push(normalizeSourceUrl(urlMatch[0]));
      } catch {
        errors.push(`${id}: 来源 URL 无法解析：${urlMatch[0]}`);
      }
    }
    if (validUrls.length === 0) {
      errors.push(`${id}: canonical 来源必须包含有效 URL`);
      continue;
    }
    resolvedIds.add(id);
    for (const normalized of validUrls) {
      if (urls.has(normalized)) {
        errors.push(`来源 URL 重复：${urls.get(normalized)} 与 ${id}`);
      } else {
        urls.set(normalized, id);
      }
    }
  }

  const aliasCounts = new Map();
  for (const match of markdown.matchAll(
    /<span[ \t]+id="r([1-9][0-9]*)"[ \t]*><\/span>/g,
  )) {
    const alias = `R${match[1]}`;
    aliasCounts.set(alias, (aliasCounts.get(alias) ?? 0) + 1);
    if (!allowedAliases.has(alias)) {
      errors.push(`${alias}: 未允许的来源别名`);
    }
  }
  for (const [alias, target] of allowedAliases) {
    const anchor = alias.toLowerCase();
    if (!markdown.includes(`[${alias}](#${anchor})`)) {
      errors.push(`${alias}: 缺少可点击兼容编号入口`);
    }
    if (
      aliasCounts.get(alias) !== 1 ||
      !markdown.includes(`[${target}](#${target.toLowerCase()})`) ||
      !resolvedIds.has(target)
    ) {
      errors.push(`${alias}: 兼容锚点必须唯一指向有效的 ${target}`);
    }
  }
  return { errors, resolvedIds };
}

export function validateSourceCatalog(markdown, { allowedAliases }) {
  return analyzeSourceCatalog(markdown, allowedAliases).errors;
}

export function extractSourceIds(
  markdown,
  { allowedAliases = new Map() } = {},
) {
  return analyzeSourceCatalog(markdown, allowedAliases).resolvedIds;
}

export function validateSourceReferences({
  ledger,
  caseMap,
  source,
  allowedAliases = new Map(),
}) {
  const errors = [];
  const ids = extractSourceIds(source, { allowedAliases });
  const references = [
    ...(Array.isArray(ledger?.claims)
      ? ledger.claims.flatMap((claim, index) =>
          claim && typeof claim === "object"
            ? [[claim.claim_id ?? `claims[${index}]`, claim.source?.source_ref]]
            : [],
        )
      : []),
    ...(Array.isArray(caseMap?.cases)
      ? caseMap.cases.flatMap((item, index) =>
          item && typeof item === "object"
            ? [[item.case_id ?? `cases[${index}]`, item.source_ref]]
            : [],
        )
      : []),
  ];
  for (const [owner, reference] of references) {
    if (typeof reference === "string" && !ids.has(reference)) {
      errors.push(
        `${owner}: source_ref ${reference} 不存在于有效的 canonical 来源目录`,
      );
    }
  }
  return errors;
}

export function validatePublicCaseCountReferences(documents, expectedCount) {
  const errors = [];
  for (const [path, source] of documents) {
    let markerCount = 0;
    for (const match of source.matchAll(
      /<span data-public-case-count="(\d+)">(\d+)<\/span>/g,
    )) {
      markerCount += 1;
      if (
        Number(match[1]) !== expectedCount ||
        Number(match[2]) !== expectedCount
      ) {
        errors.push(`${path}: 公开案例计数必须为 ${expectedCount}`);
      }
    }
    if (markerCount !== 1) {
      errors.push(`${path}: 必须恰好包含一个公开案例计数标记`);
    }
  }
  return errors;
}

export function validatePublicCaseMembership(source, caseMap) {
  const errors = [];
  const expected = new Set(
    caseMap.cases
      .filter((item) => item.included_in_public_count)
      .map((item) => item.case_id),
  );
  const seen = new Set();
  const standard =
    /<span data-public-case-id="(case-[a-z0-9]+(?:-[a-z0-9]+)*)"><\/span>/g;
  for (const match of source.matchAll(standard)) {
    const id = match[1];
    if (seen.has(id)) errors.push(`${id}: 公开案例成员标记重复`);
    seen.add(id);
    if (!expected.has(id)) {
      errors.push(`${id}: 未通过发布门，不得进入公开案例清单`);
    }
  }
  for (const match of source.matchAll(/data-public-case-id="([^"]+)"/g)) {
    if (!seen.has(match[1])) {
      errors.push(`${match[1]}: 非标准公开案例成员标记`);
    }
  }
  for (const id of expected) {
    if (!seen.has(id)) errors.push(`缺少公开案例 ${id}`);
  }
  return errors;
}
