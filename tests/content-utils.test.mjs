import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveConfig } from "vitepress";

import validCaseMap from "./fixtures/evidence/case-map-valid-32.mjs";

import {
  BLUEBOOK_V2_NEXT_CHAIN,
  BLUEBOOK_V2_PATHS,
  BLUEBOOK_V2_SIDEBAR_GROUPS,
  containsSensitivePattern,
  extractClaimMarkers,
  findAuthorMarkers,
  flattenBluebookSidebar,
  LEGACY_PAGE_MAP,
  normalizeSourceUrl,
  parseFrontmatter,
  REQUIRED_CASE_SECTIONS,
  validateBluebookNextChain,
  validateBluebookStructure,
  validateCaseBody,
  validateCaseSourceMap,
  validateClaimReferences,
  validateCompatibilityPage,
  validateEvidenceLedger,
  validatePageMeta,
  validatePublicCaseCountReferences,
  validatePublicCaseMembership,
  validateSourceCatalog,
  validateSourceReferences,
} from "../scripts/content-utils.mjs";
import { validateContentRoots } from "../scripts/validate-content.mjs";

const fixturesDirectory = new URL("./fixtures/", import.meta.url);
const evidenceFixtures = new URL("./fixtures/evidence/", import.meta.url);
const docsRoot = fileURLToPath(new URL("../docs", import.meta.url));

const EXPECTED_LEGACY_PAGE_MAP = [
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
];

const EXPECTED_BLUEBOOK_V2_NEXT_CHAIN = [
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

const EXPECTED_BLUEBOOK_V2_SIDEBAR_GROUPS = [
  {
    text: "序章",
    items: [
      {
        text: "企业 AI 从功能竞赛走向工作流竞赛",
        link: "/bluebook/executive-summary",
      },
    ],
  },
  {
    text: "第一篇：完成一次交付",
    items: [
      {
        text: "第 1 章 交付新标准",
        link: "/bluebook/part-1/01-delivery-standard",
      },
      {
        text: "第 2 章 任务拆解与验收",
        link: "/bluebook/part-1/02-task-delivery-protocol",
      },
    ],
  },
  {
    text: "第二篇：沉淀一条工作流",
    items: [
      {
        text: "第 3 章 工作环境与能力架构",
        link: "/bluebook/part-2/03-work-environment-architecture",
      },
      {
        text: "第 4 章 Skill、连接器与专家套件",
        link: "/bluebook/part-2/04-skills-connectors-expert-kits",
      },
      {
        text: "第 5 章 自动化及其边界",
        link: "/bluebook/part-2/05-automation-boundaries",
      },
    ],
  },
  {
    text: "第三篇：应用于专业场景",
    items: [
      {
        text: "第 6 章 办公交付",
        link: "/bluebook/part-3/06-office-delivery",
      },
      {
        text: "第 7 章 岗位路线",
        link: "/bluebook/part-3/07-role-roadmaps",
      },
      {
        text: "第 8 章 研究与证据链",
        link: "/bluebook/part-3/08-research-evidence-chain",
      },
      {
        text: "第 9 章 公开案例图谱",
        link: "/bluebook/part-3/09-public-case-atlas",
      },
    ],
  },
  {
    text: "第四篇：扩展为组织能力",
    items: [
      {
        text: "第 10 章 场景选择与试点",
        link: "/bluebook/part-4/10-pilot-roadmap",
      },
      {
        text: "第 11 章 安全、权限与责任",
        link: "/bluebook/part-4/11-security-governance",
      },
      {
        text: "第 12 章 团队工作流运营",
        link: "/bluebook/part-4/12-workflow-operations",
      },
      {
        text: "第 13 章 价值度量",
        link: "/bluebook/part-4/13-value-measurement",
      },
    ],
  },
  {
    text: "结语",
    items: [
      {
        text: "产品与生态路线建议",
        link: "/bluebook/conclusion-product-ecosystem",
      },
    ],
  },
  {
    text: "附录",
    items: [
      {
        text: "常用指令模板",
        link: "/bluebook/appendices/prompt-templates",
      },
      {
        text: "场景速查与评分表",
        link: "/bluebook/appendices/scenario-index",
      },
      {
        text: "组织上线验收清单",
        link: "/bluebook/appendices/launch-checklist",
      },
      {
        text: "主张证据台账",
        link: "/bluebook/appendices/evidence-ledger",
      },
      {
        text: "案例来源映射",
        link: "/bluebook/appendices/case-source-map",
      },
      {
        text: "来源与延伸阅读",
        link: "/bluebook/appendices/sources",
      },
    ],
  },
];

function bluebookPathToUrl(path) {
  return `/${path.slice("docs/".length, -".md".length)}`;
}

function canonicalTestPage(path) {
  const next = EXPECTED_BLUEBOOK_V2_NEXT_CHAIN.find(
    ([sourcePath]) => sourcePath === path,
  )?.[1];
  const nextSection = next
    ? `\n## 边界与下一步\n\n[继续阅读](${next})\n`
    : "";
  return `---
title: ${path}
description: V2 规范页面
status: community-practice
verifiedAt: 2026-08-01
sources: []
---

# V2 规范页面
${nextSection}`;
}

async function validBluebookDocuments() {
  const compatibilityFixture = await readFile(
    new URL("compatibility-page-valid.md", evidenceFixtures),
    "utf8",
  );
  const fixtureCanonical = "/bluebook/part-1/01-delivery-standard";
  const documents = new Map(
    BLUEBOOK_V2_PATHS.map((path) => [path, canonicalTestPage(path)]),
  );
  documents.set(
    "docs/bluebook/index.md",
    `---
title: 蓝皮书
description: V2 蓝皮书首页
status: community-practice
verifiedAt: 2026-08-01
sources: []
---

# 蓝皮书

## 附录
`,
  );
  for (const [path, canonical] of LEGACY_PAGE_MAP) {
    documents.set(
      path,
      compatibilityFixture.replaceAll(fixtureCanonical, canonical),
    );
  }
  return documents;
}

async function readJsonFixture(name) {
  return JSON.parse(await readFile(new URL(name, evidenceFixtures), "utf8"));
}

test("parseFrontmatter parses scalar and list values", async () => {
  const content = await readFile(
    new URL("valid-page.md", fixturesDirectory),
    "utf8",
  );

  const { attributes } = parseFrontmatter(content);

  assert.equal(attributes.title, "测试章节");
  assert.deepEqual(attributes.sources, [
    "https://qwenwork.cn/docs/product-introduction",
  ]);
});

test("validatePageMeta rejects verified pages without sources", async () => {
  const content = await readFile(
    new URL("missing-source.md", fixturesDirectory),
    "utf8",
  );
  const { attributes } = parseFrontmatter(content);

  assert.deepEqual(validatePageMeta(attributes), [
    "verified 页面必须至少包含一个来源",
  ]);
});

test("parseFrontmatter preserves empty scalars while parsing empty lists", () => {
  const content = `---
title:
description:
status: verified
verifiedAt:
sources: []
---
`;

  const { attributes } = parseFrontmatter(content);

  assert.equal(attributes.title, "");
  assert.equal(attributes.description, "");
  assert.equal(attributes.verifiedAt, "");
  assert.deepEqual(attributes.sources, []);
});

test("validatePageMeta requires non-empty string metadata", () => {
  const errors = validatePageMeta({
    title: [],
    description: true,
    status: "verified",
    verifiedAt: 20260729,
    sources: ["https://qwenwork.cn/docs/product-introduction"],
  });

  assert.deepEqual(errors, [
    "缺少 Frontmatter 字段：title",
    "缺少 Frontmatter 字段：description",
    "缺少 Frontmatter 字段：verifiedAt",
  ]);
});

test("containsSensitivePattern detects common secret formats", () => {
  assert.equal(containsSensitivePattern("ghp_1234567890abcdef"), true);
  assert.equal(containsSensitivePattern("AKIA1234567890ABCDEF"), true);
  assert.equal(containsSensitivePattern("-----BEGIN PRIVATE KEY-----"), true);
  assert.equal(
    containsSensitivePattern("password: actual-secret-value-123"),
    true,
  );
  assert.equal(containsSensitivePattern("这是普通内容"), false);
});

test("containsSensitivePattern supports spaced API key labels", () => {
  assert.equal(
    containsSensitivePattern("API key: actual-secret-value-123"),
    true,
  );
});

test("containsSensitivePattern ignores safe credential placeholders", () => {
  assert.equal(containsSensitivePattern("token=YOUR_TOKEN_HERE"), false);
  assert.equal(
    containsSensitivePattern("password: replace-with-your-password"),
    false,
  );
});

test("containsSensitivePattern checks every credential assignment", () => {
  assert.equal(
    containsSensitivePattern(
      "token=YOUR_TOKEN_HERE\npassword=actual-secret-value-123",
    ),
    true,
  );
});

test("parseFrontmatter supports CRLF line endings", () => {
  const content =
    "---\r\ntitle: Windows\r\nsources: []\r\n---\r\n# Body\r\n";

  const { attributes, body } = parseFrontmatter(content);

  assert.equal(attributes.title, "Windows");
  assert.deepEqual(attributes.sources, []);
  assert.equal(body, "# Body\r\n");
});

test("parseFrontmatter supports closing delimiters at EOF", () => {
  const { attributes, body } = parseFrontmatter("---\ntitle: EOF\n---");

  assert.equal(attributes.title, "EOF");
  assert.equal(body, "");
});

test("validateCaseBody accepts a complete case", async () => {
  const content = await readFile(
    new URL("valid-case.md", fixturesDirectory),
    "utf8",
  );
  const { body } = parseFrontmatter(content);

  assert.deepEqual(validateCaseBody(body), []);
});

test("validateCaseBody reports missing required sections", () => {
  const errors = validateCaseBody("# 不完整案例\n\n## 场景与问题");

  assert.ok(errors.includes("案例缺少章节：验收标准"));
  assert.ok(errors.includes("案例缺少章节：权限与安全边界"));
});

test("validateCaseBody ignores required headings inside non-Markdown blocks", () => {
  const headings = REQUIRED_CASE_SECTIONS.map(
    (section) => `## ${section}`,
  ).join("\n");
  const expectedErrors = REQUIRED_CASE_SECTIONS.map(
    (section) => `案例缺少章节：${section}`,
  );
  const disguisedBodies = [
    `\`\`\`markdown\n${headings}\n\`\`\``,
    `~~~markdown\n${headings}\n~~~`,
    REQUIRED_CASE_SECTIONS.map(
      (section) => `<!-- ## ${section} -->`,
    ).join("\n"),
    `<!--\n${headings}\n-->`,
    REQUIRED_CASE_SECTIONS.map((section) => `    ## ${section}`).join("\n"),
    REQUIRED_CASE_SECTIONS.map((section) => `\t## ${section}`).join("\n"),
  ];

  for (const body of disguisedBodies) {
    assert.deepEqual(validateCaseBody(body), expectedErrors);
  }
});

test("validateCaseBody ignores fenced headings when info contains an HTML comment", () => {
  const headings = REQUIRED_CASE_SECTIONS.map(
    (section) => `## ${section}`,
  ).join("\n");
  const body = `\`\`\`markdown <!-- example -->\n${headings}\n\`\`\``;

  assert.deepEqual(
    validateCaseBody(body),
    REQUIRED_CASE_SECTIONS.map((section) => `案例缺少章节：${section}`),
  );
});

test("validateCaseBody ignores headings inside raw HTML blocks", () => {
  const headings = REQUIRED_CASE_SECTIONS.map(
    (section) => `## ${section}`,
  ).join("\n");
  const body = `<script>\n${headings}\n</script>`;

  assert.deepEqual(
    validateCaseBody(body),
    REQUIRED_CASE_SECTIONS.map((section) => `案例缺少章节：${section}`),
  );
});

test("validateCaseBody normalizes ATX closing sequences", () => {
  const body = REQUIRED_CASE_SECTIONS.map(
    (section) => `## ${section} ##`,
  ).join("\n");

  assert.deepEqual(validateCaseBody(body), []);
});

test("validateCaseBody rejects closing sequences followed by HTML comments", () => {
  const body = REQUIRED_CASE_SECTIONS.map(
    (section) => `## ${section} ## <!-- suffix -->`,
  ).join("\n");

  assert.deepEqual(
    validateCaseBody(body),
    REQUIRED_CASE_SECTIONS.map((section) => `案例缺少章节：${section}`),
  );
});

test("validateCaseBody ignores headings inside type-7 HTML blocks", () => {
  const headings = REQUIRED_CASE_SECTIONS.map(
    (section) => `## ${section}`,
  ).join("\n");
  const body = `<custom-panel>\n${headings}\n</custom-panel>\n`;

  assert.deepEqual(
    validateCaseBody(body),
    REQUIRED_CASE_SECTIONS.map((section) => `案例缺少章节：${section}`),
  );
});

test("validateCaseBody lets type-7 tags continue an active paragraph", () => {
  const headings = REQUIRED_CASE_SECTIONS.map(
    (section) => `## ${section}`,
  ).join("\n");
  const body = `段落正文\n<custom-panel>\n${headings}\n</custom-panel>\n`;

  assert.deepEqual(validateCaseBody(body), []);
});

test("validateEvidenceLedger accepts the approved schema", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  assert.deepEqual(
    validateEvidenceLedger(ledger, { today: "2026-08-01" }),
    [],
  );
});

test("validateEvidenceLedger enforces claim status invariants", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  const claim = ledger.claims[0];
  claim.claim_type = "product-fact";
  claim.verification_status = "editor-reviewed";
  assert.ok(
    validateEvidenceLedger(ledger, { today: "2026-08-01" }).some((error) =>
      error.includes("editor-reviewed"),
    ),
  );

  claim.claim_type = "community-judgment";
  claim.verification_status = "pending";
  assert.ok(
    validateEvidenceLedger(ledger, { today: "2026-08-01" }).some((error) =>
      error.includes("blocks_release"),
    ),
  );

  claim.summary_eligible = false;
  claim.blocks_release = false;
  claim.content_path = null;
  claim.content_anchor = null;
  assert.deepEqual(
    validateEvidenceLedger(ledger, { today: "2026-08-01" }),
    [],
  );
});

test("validateEvidenceLedger requires a complete customer evidence package", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  const claim = ledger.claims[0];
  claim.claim_type = "customer-result";
  claim.verification_status = "limited";
  claim.source.source_type = "customer-authorized";
  claim.source.external_record_id = "customer-record-001";
  claim.source.deep_link = "https://example.com/customer-record-001";
  assert.ok(
    validateEvidenceLedger(ledger, { today: "2026-08-01" }).some((error) =>
      error.includes("customer_evidence"),
    ),
  );

  claim.customer_evidence = {
    authorization_scope: "客户书面授权公开该指标、口径和样本范围",
    metric_definition: "有效任务按一次完整交付计，单位为项",
    denominator: "授权样本期内完成验收的全部有效任务",
    sample_size: 42,
    sample_period: "2026-01-01/2026-03-31",
    comparison_period: "2025-10-01/2025-12-31",
    comparison_basis: "同业务范围、同口径的前后期比较",
    human_work_included: {
      input_preparation: true,
      review: true,
      rework: true,
    },
    audit_disclosure: "客户陈述、未经独立审计",
  };
  assert.equal(
    validateEvidenceLedger(ledger, { today: "2026-08-01" }).some((error) =>
      error.includes("customer_evidence"),
    ),
    false,
  );
  delete claim.customer_evidence.denominator;
  assert.ok(
    validateEvidenceLedger(ledger, { today: "2026-08-01" }).some((error) =>
      error.includes("customer_evidence.denominator"),
    ),
  );
});

test("validateEvidenceLedger requires traceable external source material", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  const claim = ledger.claims[0];
  claim.claim_type = "product-fact";
  claim.verification_status = "verified";
  claim.source.source_type = "official-product";
  claim.source.deep_link = null;
  claim.source.snapshot_path = null;
  claim.source.excerpt = null;
  claim.source.content_hash = null;
  assert.ok(
    validateEvidenceLedger(ledger, { today: "2026-08-01" }).some((error) =>
      error.includes("外部来源定位"),
    ),
  );

  claim.verification_status = "limited";
  claim.source.excerpt = "官方页面原文摘记";
  claim.source.accessed_at = "2026-08-01";
  claim.source.content_hash = `sha256:${"a".repeat(64)}`;
  assert.equal(
    validateEvidenceLedger(ledger, { today: "2026-08-01" }).some((error) =>
      error.includes("外部来源定位"),
    ),
    false,
  );
});

test("validateEvidenceLedger marks expired claims stale", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  ledger.claims[0].stale_after = "2026-07-31";
  assert.ok(
    validateEvidenceLedger(ledger, { today: "2026-08-01" }).some((error) =>
      error.includes("stale_after"),
    ),
  );
});

test("validateEvidenceLedger rejects malformed nested fields without throwing", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  Object.assign(ledger.claims[0], {
    limitations: "not-an-array",
    conflicts: [null],
    last_verified_at: "2026-99-99",
  });
  Object.assign(ledger.claims[0].source, {
    source_ref: "source-eleven",
    deep_link: "not-a-url",
    content_hash: "sha256:bad",
    accessed_at: "yesterday",
  });
  const errors = validateEvidenceLedger(ledger, { today: "2026-08-01" });
  for (const field of [
    "limitations",
    "conflicts",
    "last_verified_at",
    "source_ref",
    "deep_link",
    "content_hash",
    "accessed_at",
  ]) {
    assert.ok(errors.some((error) => error.includes(field)), field);
  }
});

test("validateEvidenceLedger rejects non-object claim entries without throwing", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  ledger.claims[0] = null;
  assert.ok(
    validateEvidenceLedger(ledger, { today: "2026-08-01" }).some((error) =>
      error.includes("claims[0]: 必须为对象"),
    ),
  );
});

test("validateEvidenceLedger requires public snapshot paths and hashes", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  const source = ledger.claims[0].source;
  source.snapshot_path = "../private/source.html";
  assert.ok(
    validateEvidenceLedger(ledger, { today: "2026-08-01" }).some((error) =>
      error.includes("snapshot_path"),
    ),
  );
  source.snapshot_path = "docs/public/evidence-snapshots/source.html";
  source.content_hash = null;
  assert.ok(
    validateEvidenceLedger(ledger, { today: "2026-08-01" }).some((error) =>
      error.includes("snapshot_path 要求 content_hash"),
    ),
  );
});

test("validateCaseSourceMap accepts exactly 32 candidate cases", () => {
  const caseMap = structuredClone(validCaseMap);
  assert.deepEqual(validateCaseSourceMap(caseMap), []);
});

test("validateCaseSourceMap rejects duplicate and malformed case ids", () => {
  const caseMap = structuredClone(validCaseMap);
  caseMap.cases[1].case_id = caseMap.cases[0].case_id;
  const errors = validateCaseSourceMap(caseMap);
  assert.ok(errors.some((error) => error.includes("case_id 重复")));
});

test("validateCaseSourceMap enforces public source evidence", () => {
  const caseMap = structuredClone(validCaseMap);
  Object.assign(caseMap.cases[0], {
    verification_status: "limited",
    included_in_public_count: true,
    external_record_id: null,
  });
  assert.ok(
    validateCaseSourceMap(caseMap).some((error) =>
      error.includes("external_record_id"),
    ),
  );

  caseMap.cases[0].external_record_id = "external-case-record-001";
  caseMap.cases[0].deep_link = "https://artifact.example/demo";
  caseMap.cases[0].artifact_links = ["https://artifact.example/demo"];
  assert.ok(
    validateCaseSourceMap(caseMap).some((error) =>
      error.includes("示例产物链接不能代替来源定位"),
    ),
  );
});

test("validateCaseSourceMap rejects book ids used as external ids", () => {
  const caseMap = structuredClone(validCaseMap);
  Object.assign(caseMap.cases[0], {
    verification_status: "verified",
    included_in_public_count: true,
    external_record_id: caseMap.cases[0].case_id,
  });
  assert.ok(
    validateCaseSourceMap(caseMap).some((error) =>
      error.includes("不能等于 case_id"),
    ),
  );
});

test("validateCaseSourceMap accepts a traceable limited public case", () => {
  const caseMap = structuredClone(validCaseMap);
  Object.assign(caseMap.cases[0], {
    verification_status: "limited",
    included_in_public_count: true,
    external_record_id: "external-case-record-001",
    deep_link: null,
    snapshot_path: "docs/public/evidence-snapshots/case-001.html",
    content_hash: `sha256:${"b".repeat(64)}`,
    artifact_links: ["https://artifact.example/demo-001"],
    limitations: ["样本和外推范围有限。"],
  });
  assert.deepEqual(validateCaseSourceMap(caseMap), []);
});

test("validateCaseSourceMap reports malformed nested fields without throwing", () => {
  const caseMap = structuredClone(validCaseMap);
  Object.assign(caseMap.cases[0], {
    source_ref: "source-eleven",
    verified_at: "2026-99-99",
    original_tags: "not-an-array",
    artifact_links: "not-an-array",
    limitations: [],
    deep_link: "not-a-url",
    content_hash: "sha256:bad",
  });
  const errors = validateCaseSourceMap(caseMap);
  for (const field of [
    "source_ref",
    "verified_at",
    "original_tags",
    "artifact_links",
    "limitations",
    "deep_link",
    "content_hash",
  ]) {
    assert.ok(errors.some((error) => error.includes(field)), field);
  }
});

test("validateCaseSourceMap rejects non-object case entries without throwing", () => {
  const caseMap = structuredClone(validCaseMap);
  caseMap.cases[0] = null;
  assert.ok(
    validateCaseSourceMap(caseMap).some((error) =>
      error.includes("cases[0]: 必须为对象"),
    ),
  );
});

test("validateCaseSourceMap requires public snapshot paths and hashes", () => {
  const caseMap = structuredClone(validCaseMap);
  const item = caseMap.cases[0];
  item.snapshot_path = "/private/source.html";
  assert.ok(
    validateCaseSourceMap(caseMap).some((error) =>
      error.includes("snapshot_path"),
    ),
  );
  item.snapshot_path = "docs/public/evidence-snapshots/case-001.html";
  item.content_hash = null;
  assert.ok(
    validateCaseSourceMap(caseMap).some((error) =>
      error.includes("snapshot_path 要求 content_hash"),
    ),
  );
});

test("extractClaimMarkers accepts only the standard claim span", () => {
  const valid =
    '<span id="claim-a-01" data-claim-id="claim-a-01"></span>';
  assert.deepEqual(extractClaimMarkers(valid, "docs/page.md"), {
    markers: [{ claimId: "claim-a-01", contentPath: "docs/page.md" }],
    errors: [],
  });
  const invalid =
    '<span data-claim-id="claim-a-01" id="claim-b-01"></span>';
  assert.ok(extractClaimMarkers(invalid, "docs/page.md").errors.length > 0);
});

test("validateClaimReferences requires summary paragraphs and table rows to be marked", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  ledger.claims.push({
    ...structuredClone(ledger.claims[0]),
    claim_id: "claim-workflow-action-01",
    content_anchor: "claim-workflow-action-01",
    claim_text: "先定义验收，再启动任务。",
  });
  const valid = await readFile(
    new URL("executive-summary-valid.md", evidenceFixtures),
    "utf8",
  );
  assert.deepEqual(
    validateClaimReferences({
      ledger,
      documents: new Map([["docs/bluebook/executive-summary.md", valid]]),
      executiveSummaryPath: "docs/bluebook/executive-summary.md",
    }),
    [],
  );

  const invalid = `${valid}\n这个段落没有主张标记。\n`;
  assert.ok(
    validateClaimReferences({
      ledger,
      documents: new Map([["docs/bluebook/executive-summary.md", invalid]]),
      executiveSummaryPath: "docs/bluebook/executive-summary.md",
    }).some((error) => error.includes("执行摘要未关联 claim_id")),
  );

  const unlabeledJudgment = valid.replace("本书主张：", "");
  assert.ok(
    validateClaimReferences({
      ledger,
      documents: new Map([
        ["docs/bluebook/executive-summary.md", unlabeledJudgment],
      ]),
      executiveSummaryPath: "docs/bluebook/executive-summary.md",
    }).some((error) => error.includes("本书主张/本书建议")),
  );

  ledger.claims[0].verification_status = "limited";
  assert.ok(
    validateClaimReferences({
      ledger,
      documents: new Map([["docs/bluebook/executive-summary.md", valid]]),
      executiveSummaryPath: "docs/bluebook/executive-summary.md",
    }).some((error) => error.includes("limited 主张必须同块披露局限")),
  );
  const disclosed = valid.replace(
    "工作流。",
    "工作流。（局限：这是限定范围内的判断。）",
  );
  assert.equal(
    validateClaimReferences({
      ledger,
      documents: new Map([["docs/bluebook/executive-summary.md", disclosed]]),
      executiveSummaryPath: "docs/bluebook/executive-summary.md",
    }).some((error) => error.includes("limited 主张必须同块披露局限")),
    false,
  );
});

test("validateClaimReferences enforces claim and page publication states", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  const source = await readFile(
    new URL("executive-summary-valid.md", evidenceFixtures),
    "utf8",
  );
  const oneClaimSource = source.replace(/\n\| 判断[\s\S]*$/, "\n");
  ledger.claims[0].verification_status = "pending";
  ledger.claims[0].summary_eligible = false;
  ledger.claims[0].blocks_release = false;
  assert.ok(
    validateClaimReferences({
      ledger,
      documents: new Map([
        ["docs/bluebook/executive-summary.md", oneClaimSource],
      ]),
      executiveSummaryPath: "docs/bluebook/other-summary.md",
    }).some((error) =>
      error.includes("pending 或 stale 主张不得出现在发布正文"),
    ),
  );

  ledger.claims[0].verification_status = "editor-reviewed";
  const verifiedPage = oneClaimSource.replace(
    "status: community-practice",
    "status: verified",
  );
  assert.ok(
    validateClaimReferences({
      ledger,
      documents: new Map([
        ["docs/bluebook/executive-summary.md", verifiedPage],
      ]),
      executiveSummaryPath: "docs/bluebook/other-summary.md",
    }).some((error) => error.includes("verified 页面")),
  );

  ledger.claims[0].content_path = "docs/bluebook/missing.md";
  assert.ok(
    validateClaimReferences({
      ledger,
      documents: new Map([
        ["docs/bluebook/executive-summary.md", oneClaimSource],
      ]),
      executiveSummaryPath: "docs/bluebook/other-summary.md",
    }).some((error) => error.includes("正文路径不存在")),
  );
});

test("normalizeSourceUrl removes tracking and normalizes host and trailing slash", () => {
  assert.equal(
    normalizeSourceUrl(
      "HTTPS://QWENWORK.CN/docs/features/skills/?utm_source=test#intro",
    ),
    "https://qwenwork.cn/docs/features/skills",
  );
});

test("validateSourceCatalog permits only the R14 and R15 aliases", async () => {
  const source = await readFile(
    new URL("sources-valid-aliases.md", evidenceFixtures),
    "utf8",
  );
  assert.deepEqual(
    validateSourceCatalog(source, {
      allowedAliases: new Map([
        ["R14", "R8"],
        ["R15", "R4"],
      ]),
    }),
    [],
  );
  const duplicate = `${source}\n## R16\n\n[重复](https://qwenwork.cn/docs/features/skills/)\n`;
  assert.ok(
    validateSourceCatalog(duplicate, {
      allowedAliases: new Map([
        ["R14", "R8"],
        ["R15", "R4"],
      ]),
    }).some((error) => error.includes("来源 URL 重复")),
  );

  const withoutClickableEntries = source.replace(/^兼容编号入口：.*\n\n/m, "");
  assert.ok(
    validateSourceCatalog(withoutClickableEntries, {
      allowedAliases: new Map([
        ["R14", "R8"],
        ["R15", "R4"],
      ]),
    }).some((error) => error.includes("缺少可点击兼容编号入口")),
  );

  const duplicateId = `${source}\n## R8\n\n[另一来源](https://example.com/r8)\n`;
  assert.ok(
    validateSourceCatalog(duplicateId, {
      allowedAliases: new Map([
        ["R14", "R8"],
        ["R15", "R4"],
      ]),
    }).some((error) => error.includes("R8: 来源 ID 重复")),
  );

  const emptyCanonical = `${source}\n## R99\n`;
  assert.ok(
    validateSourceCatalog(emptyCanonical, {
      allowedAliases: new Map([
        ["R14", "R8"],
        ["R15", "R4"],
      ]),
    }).some((error) => error.includes("R99: canonical 来源必须包含有效 URL")),
  );

  const unapprovedAlias = `${source}\n<span id="r98"></span>`;
  assert.ok(
    validateSourceCatalog(unapprovedAlias, {
      allowedAliases: new Map([
        ["R14", "R8"],
        ["R15", "R4"],
      ]),
    }).some((error) => error.includes("R98: 未允许的来源别名")),
  );
});

test("validateSourceReferences requires every R id to exist in the catalog", async () => {
  const source = await readFile(
    new URL("sources-valid-aliases.md", evidenceFixtures),
    "utf8",
  );
  const ledger = await readJsonFixture("ledger-valid.json");
  ledger.claims[0].source.source_ref = "R8";
  assert.deepEqual(
    validateSourceReferences({ ledger, caseMap: validCaseMap, source }),
    [],
  );
  ledger.claims[0].source.source_ref = "R99";
  assert.ok(
    validateSourceReferences({ ledger, caseMap: validCaseMap, source }).some(
      (error) => error.includes("R99"),
    ),
  );
  const fakeSources = `${source}\n## R99\n\n<span id="r98"></span>`;
  assert.ok(
    validateSourceReferences({
      ledger,
      caseMap: validCaseMap,
      source: fakeSources,
    }).some((error) => error.includes("R99")),
  );
  ledger.claims[0].source.source_ref = "R14";
  assert.ok(
    validateSourceReferences({ ledger, caseMap: validCaseMap, source }).some(
      (error) => error.includes("R14"),
    ),
  );
  const invalidCaseMap = structuredClone(validCaseMap);
  invalidCaseMap.cases[0].source_ref = "R98";
  assert.ok(
    validateSourceReferences({
      ledger: { claims: [] },
      caseMap: invalidCaseMap,
      source,
    }).some((error) => error.includes("R98")),
  );
});

test("validatePublicCaseCountReferences matches every count marker", () => {
  const documents = new Map([
    [
      "docs/cases/index.md",
      '<span data-public-case-count="3">3</span> 个公开案例',
    ],
  ]);
  assert.deepEqual(validatePublicCaseCountReferences(documents, 3), []);
  assert.ok(
    validatePublicCaseCountReferences(documents, 2)[0].includes(
      "公开案例计数",
    ),
  );
});

test("validatePublicCaseMembership requires the exact published case set", () => {
  const caseMap = structuredClone(validCaseMap);
  const publicId = caseMap.cases[0].case_id;
  caseMap.cases[0].included_in_public_count = true;
  const valid = `<span data-public-case-id="${publicId}"></span>`;
  assert.deepEqual(validatePublicCaseMembership(valid, caseMap), []);
  assert.ok(
    validatePublicCaseMembership("", caseMap).some((error) =>
      error.includes(`缺少公开案例 ${publicId}`),
    ),
  );
  assert.ok(
    validatePublicCaseMembership(`${valid}\n${valid}`, caseMap).some((error) =>
      error.includes("重复"),
    ),
  );
  const pendingId = caseMap.cases[1].case_id;
  assert.ok(
    validatePublicCaseMembership(
      `${valid}\n<span data-public-case-id="${pendingId}"></span>`,
      caseMap,
    ).some((error) => error.includes("未通过发布门")),
  );
  assert.ok(
    validatePublicCaseMembership(
      `${valid}\n<span data-public-case-id="bad"></span>`,
      caseMap,
    ).some((error) => error.includes("非标准")),
  );
});

test("CompatibilityPage accepts canonical migration metadata and one link", async () => {
  const source = await readFile(
    new URL("compatibility-page-valid.md", evidenceFixtures),
    "utf8",
  );

  assert.deepEqual(
    validateCompatibilityPage(
      source,
      "/bluebook/part-1/01-delivery-standard",
    ),
    [],
  );
});

test("CompatibilityPage accepts short prose around its canonical inline link", async () => {
  const source = await readFile(
    new URL("compatibility-page-valid.md", evidenceFixtures),
    "utf8",
  );
  const withProse = source.replace(
    "[前往规范页面](/bluebook/part-1/01-delivery-standard)",
    "本章已合并到[交付新标准](/bluebook/part-1/01-delivery-standard)。",
  );

  assert.deepEqual(
    validateCompatibilityPage(
      withProse,
      "/bluebook/part-1/01-delivery-standard",
    ),
    [],
  );
});

test("CompatibilityPage rejects search exposure and copied body text", async () => {
  const source = await readFile(
    new URL("compatibility-page-valid.md", evidenceFixtures),
    "utf8",
  );
  const searchable = source.replace("search: false", "search: true");
  assert.ok(
    validateCompatibilityPage(
      searchable,
      "/bluebook/part-1/01-delivery-standard",
    ).some((error) => error.includes("search")),
  );

  const copied = source.replace(
    "[前往规范页面]",
    `${"这是一段复制的旧正文。".repeat(61)}\n\n[前往规范页面]`,
  );
  assert.ok(
    validateCompatibilityPage(
      copied,
      "/bluebook/part-1/01-delivery-standard",
    ).some((error) => /过长|复制旧正文/.test(error)),
  );
});

test("CompatibilityPage requires complete page metadata", async () => {
  const source = await readFile(
    new URL("compatibility-page-valid.md", evidenceFixtures),
    "utf8",
  );
  const missingTitle = source.replace("title: 旧章节已迁移\n", "");

  assert.ok(
    validateCompatibilityPage(
      missingTitle,
      "/bluebook/part-1/01-delivery-standard",
    ).some((error) => error.includes("title")),
  );

  const missingSources = source.replace(
    "sources:\n  - https://qwenwork.cn/docs/product-introduction\n",
    "",
  );
  assert.ok(
    validateCompatibilityPage(
      missingSources,
      "/bluebook/part-1/01-delivery-standard",
    ).some((error) => error.includes("sources")),
  );
});

test("CompatibilityPage rejects fenced copies of old body content", async () => {
  const source = await readFile(
    new URL("compatibility-page-valid.md", evidenceFixtures),
    "utf8",
  );
  const copied = `${source}
\`\`\`text
${"复制的旧正文。".repeat(61)}
\`\`\`
`;

  assert.ok(validateCompatibilityPage(copied, "/bluebook/part-1/01-delivery-standard").length > 0);
});

test("CompatibilityPage rejects links, images, raw HTML, and redirects on the H1 line", async () => {
  const source = await readFile(
    new URL("compatibility-page-valid.md", evidenceFixtures),
    "utf8",
  );
  const additions = [
    '<a href="/wrong">错误链接</a>',
    "<script>window.location='/wrong'</script>",
    "[错误引用][ref]",
    "![错误图片](/wrong.png)",
    "<https://example.com>",
    "https://evil.example",
    "evil@example.com",
  ];

  for (const addition of additions) {
    const invalid = source.replace(
      "# 旧章节已迁移",
      `# 旧章节已迁移 ${addition}`,
    );
    assert.ok(
      validateCompatibilityPage(
        invalid,
        "/bluebook/part-1/01-delivery-standard",
      ).length > 0,
      addition,
    );
  }
});

test("CompatibilityPage rejects a body containing exactly 60 words", async () => {
  const source = await readFile(
    new URL("compatibility-page-valid.md", evidenceFixtures),
    "utf8",
  );
  const exactlySixty = source
    .replace("# 旧章节已迁移", `# ${Array(59).fill("word").join(" ")}`)
    .replace("[前往规范页面]", "[go]");

  assert.ok(
    validateCompatibilityPage(
      exactlySixty,
      "/bluebook/part-1/01-delivery-standard",
    ).some((error) => error.includes("过长")),
  );
});

test("BluebookStructure reports missing canonical and compatibility pages", async () => {
  const documents = await validBluebookDocuments();
  const missingCanonical = BLUEBOOK_V2_PATHS[0];
  const missingCompatibility = LEGACY_PAGE_MAP.keys().next().value;
  documents.delete(missingCanonical);
  documents.delete(missingCompatibility);

  const errors = validateBluebookStructure(documents);
  assert.ok(errors.some((error) => error.includes(missingCanonical)));
  assert.ok(errors.some((error) => error.includes(missingCompatibility)));
});

test("BluebookStructure requires sources metadata on canonical pages", async () => {
  const documents = await validBluebookDocuments();
  const path = BLUEBOOK_V2_PATHS[0];
  documents.set(path, documents.get(path).replace("sources: []\n", ""));

  assert.ok(
    validateBluebookStructure(documents).some(
      (error) => error.includes(path) && error.includes("sources"),
    ),
  );
});

test("BluebookStructure rejects compatibility-only suppression on canonical pages", async () => {
  const path = BLUEBOOK_V2_PATHS[0];
  const forbiddenMetadata = [
    ["robots", "robots: noindex,follow"],
    ["search", "search: false"],
    ["prev", "prev: false"],
    ["next", "next: false"],
  ];

  for (const [key, field] of forbiddenMetadata) {
    const documents = await validBluebookDocuments();
    documents.set(
      path,
      documents.get(path).replace("sources: []\n", `sources: []\n${field}\n`),
    );
    const errors = validateBluebookStructure(documents);
    assert.ok(
      errors.some((error) => error.includes(path) && error.includes(key)),
      key,
    );
  }
});

test("BluebookStructure rejects canonical metadata on a V2 canonical page", async () => {
  const documents = await validBluebookDocuments();
  const path = BLUEBOOK_V2_PATHS[0];
  documents.set(
    path,
    documents
      .get(path)
      .replace("sources: []\n", "sources: []\ncanonical: /wrong\n"),
  );

  assert.ok(
    validateBluebookStructure(documents).some(
      (error) => error.includes(path) && error.includes("canonical"),
    ),
  );
});

test("Legacy page map has exactly the 17 compatibility routes", () => {
  assert.equal(LEGACY_PAGE_MAP.size, 17);
  assert.deepEqual([...LEGACY_PAGE_MAP], EXPECTED_LEGACY_PAGE_MAP);
});

test("V2 sidebar has exactly 21 canonical items in path order", () => {
  const items = flattenBluebookSidebar(BLUEBOOK_V2_SIDEBAR_GROUPS);
  const expectedLinks = BLUEBOOK_V2_PATHS.map(bluebookPathToUrl);
  const legacyLinks = new Set([...LEGACY_PAGE_MAP.keys()].map(bluebookPathToUrl));

  assert.equal(BLUEBOOK_V2_PATHS.length, 21);
  assert.deepEqual(
    BLUEBOOK_V2_SIDEBAR_GROUPS,
    EXPECTED_BLUEBOOK_V2_SIDEBAR_GROUPS,
  );
  assert.equal(items.length, 21);
  assert.deepEqual(
    items.map((item) => item.link),
    expectedLinks,
  );
  assert.equal(items.some((item) => legacyLinks.has(item.link)), false);
});

test("production VitePress config uses the canonical V2 sidebar dependency", async () => {
  const config = await resolveConfig(docsRoot, "build", "production");

  assert.deepEqual(
    config.site.themeConfig.sidebar["/bluebook/"],
    BLUEBOOK_V2_SIDEBAR_GROUPS,
  );
  assert.ok(
    config.configDeps.some((path) =>
      path.endsWith("/scripts/content-utils.mjs"),
    ),
  );
});

test("production VitePress config adds canonical and robots page head tags", async () => {
  const config = await resolveConfig(docsRoot, "build", "production");
  const pageData = {
    frontmatter: {
      canonical: "/bluebook/part-1/01-delivery-standard",
      robots: "noindex,follow",
      head: [["meta", { name: "existing", content: "kept" }]],
    },
  };

  await config.transformPageData(pageData);

  assert.deepEqual(pageData.frontmatter.head, [
    ["meta", { name: "existing", content: "kept" }],
    [
      "link",
      {
        rel: "canonical",
        href: "https://qwenworkguide.pages.dev/bluebook/part-1/01-delivery-standard",
      },
    ],
    ["meta", { name: "robots", content: "noindex,follow" }],
  ]);
});

test("V2 next chain validates the exact 15-link sequence", async () => {
  const documents = await validBluebookDocuments();
  assert.deepEqual(
    BLUEBOOK_V2_NEXT_CHAIN,
    EXPECTED_BLUEBOOK_V2_NEXT_CHAIN,
  );
  assert.deepEqual(validateBluebookNextChain(documents), []);

  const [sourcePath, expected] = EXPECTED_BLUEBOOK_V2_NEXT_CHAIN[0];
  documents.set(
    sourcePath,
    documents.get(sourcePath).replace(`](${expected})`, "](/bluebook/broken)"),
  );
  assert.ok(
    validateBluebookNextChain(documents).some((error) =>
      error.includes(sourcePath),
    ),
  );
});

test("V2 next chain requires the appendix anchor on the bluebook home", async () => {
  const documents = await validBluebookDocuments();
  documents.set(
    "docs/bluebook/index.md",
    documents.get("docs/bluebook/index.md").replace("## 附录", "## 资料"),
  );

  assert.ok(
    validateBluebookNextChain(documents).some((error) =>
      error.includes("/bluebook/#附录"),
    ),
  );
});

test("V2 next chain requires a level-two appendix heading", async () => {
  const documents = await validBluebookDocuments();
  documents.set(
    "docs/bluebook/index.md",
    documents.get("docs/bluebook/index.md").replace("## 附录", "### 附录"),
  );

  assert.ok(
    validateBluebookNextChain(documents).some((error) =>
      error.includes("/bluebook/#附录"),
    ),
  );
});

test("V2 next chain rejects duplicate boundary sections", async () => {
  const documents = await validBluebookDocuments();
  const [sourcePath] = EXPECTED_BLUEBOOK_V2_NEXT_CHAIN[0];
  documents.set(
    sourcePath,
    `${documents.get(sourcePath)}
## 边界与下一步

[错误入口](/bluebook/broken)
`,
  );

  assert.ok(
    validateBluebookNextChain(documents).some((error) =>
      error.includes(sourcePath),
    ),
  );
});

test("V2 next chain rejects reference-style links and definitions", async () => {
  const documents = await validBluebookDocuments();
  const [sourcePath, expected] = EXPECTED_BLUEBOOK_V2_NEXT_CHAIN[0];
  documents.set(
    sourcePath,
    documents
      .get(sourcePath)
      .replace(
        `](${expected})`,
        `](${expected})\n\n[额外][ref]\n\n[ref]: /wrong`,
      ),
  );

  assert.ok(
    validateBluebookNextChain(documents).some((error) =>
      error.includes(sourcePath),
    ),
  );
});

test("V2 next chain permits boundary prose before the final inline link", async () => {
  const documents = await validBluebookDocuments();
  const [sourcePath, expected] = EXPECTED_BLUEBOOK_V2_NEXT_CHAIN[0];
  documents.set(
    sourcePath,
    documents
      .get(sourcePath)
      .replace(
        `[继续阅读](${expected})`,
        `边界说明不包含链接。\n\n[继续阅读](${expected})`,
      ),
  );

  assert.deepEqual(validateBluebookNextChain(documents), []);
});

test("BluebookStructure explicitly includes V2 next-chain failures", async () => {
  const documents = await validBluebookDocuments();
  const [sourcePath, expected] = EXPECTED_BLUEBOOK_V2_NEXT_CHAIN[0];
  documents.set(
    sourcePath,
    documents.get(sourcePath).replace(`](${expected})`, "](/bluebook/broken)"),
  );

  assert.ok(
    validateBluebookStructure(documents).some((error) =>
      error.includes(sourcePath),
    ),
  );
});

test("AuthorMarkers ignores explicit reader template code blocks", () => {
  const source = `---
title: 读者模板
---

\`\`\`text
【目标】______
\`\`\`
`;

  assert.deepEqual(findAuthorMarkers(source), []);
});

test("AuthorMarkers finds author residue outside code blocks", () => {
  const markers = [
    ["TO", "DO"].join(""),
    ["FIX", "ME"].join(""),
    ["T", "BD"].join(""),
    ["X", "XX"].join(""),
    ["待", "定"].join(""),
    ["待", "补"].join(""),
    ["待", "完善"].join(""),
  ];

  for (const marker of markers) {
    const source = `---\ntitle: 检查页\n---\n\n${marker}: 作者备注\n`;
    const matches = findAuthorMarkers(source);
    assert.equal(matches.length, 1, marker);
    assert.equal(matches[0].marker, marker);
    assert.equal(Number.isInteger(matches[0].index), true);
  }
});

test("AuthorMarkers finds author residue inside code blocks", () => {
  const marker = ["TO", "DO"].join("");
  const source = `---
title: 代码检查页
---

\`\`\`text
${marker}: 作者备注
\`\`\`
`;

  assert.deepEqual(findAuthorMarkers(source), [
    { marker, index: source.indexOf(marker) },
  ]);
});

test("AuthorMarkers ignores lowercase terms and embedded Chinese prose", () => {
  const lowercaseTerm = ["to", "do"].join("");
  const embeddedTerm = `${["待", "补"].join("")}证`;
  const source = `---
title: 正常叙述
---

字段值为 ${lowercaseTerm}，该案例仍需${embeddedTerm}后发布。
`;

  assert.deepEqual(findAuthorMarkers(source), []);
});

test("AuthorMarkers are enforced by formal content validation", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "qwg-author-markers-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const marker = ["TO", "DO"].join("");
  await writeFile(
    join(directory, "page.md"),
    `---
title: 检查页
description: 检查正式内容校验
status: community-practice
verifiedAt: 2026-08-01
sources: []
---

# 检查页

${marker}: 作者备注
`,
    "utf8",
  );

  const errors = await validateContentRoots([directory]);
  assert.ok(
    errors.some(
      (error) => error.includes(marker) && error.includes("作者遗留标记"),
    ),
  );
});

test("validateContentRoots finds bluebook under docs and ignores docs/superpowers", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "qwg-docs-root-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const documents = await validBluebookDocuments();

  for (const [path, source] of documents) {
    const target = join(directory, path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, source, "utf8");
  }
  const ignoredPage = join(directory, "docs/superpowers/ignored.md");
  await mkdir(dirname(ignoredPage), { recursive: true });
  await writeFile(ignoredPage, "# intentionally invalid\n", "utf8");

  assert.deepEqual(await validateContentRoots([join(directory, "docs")]), []);

  const missingCanonical = BLUEBOOK_V2_PATHS[0];
  await rm(join(directory, missingCanonical));
  const errors = await validateContentRoots([join(directory, "docs")]);
  assert.ok(errors.some((error) => error.includes(missingCanonical)));
  assert.equal(errors.some((error) => error.includes("superpowers")), false);
});

test("validateContentRoots rejects an empty bluebook discovered under docs", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "qwg-empty-bluebook-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, "docs/bluebook"), { recursive: true });

  const errors = await validateContentRoots([join(directory, "docs")]);
  assert.ok(errors.some((error) => error.includes(BLUEBOOK_V2_PATHS[0])));
  assert.ok(
    errors.some((error) =>
      error.includes(EXPECTED_LEGACY_PAGE_MAP[0][0]),
    ),
  );
});

test("案例库保留历史案例正文并显式标注证据边界", async () => {
  const caseIndex = await readFile(join(docsRoot, "cases/index.md"), "utf8");
  const pisenCase = await readFile(
    join(
      docsRoot,
      "cases/submissions/pisen-competitive-research-product-materials.md",
    ),
    "utf8",
  );
  const youkelaCase = await readFile(
    join(docsRoot, "cases/submissions/youkela-product-rd-payroll.md"),
    "utf8",
  );
  const publicCaseAtlas = await readFile(
    join(docsRoot, "cases/submissions/qwenwork-public-case-atlas.md"),
    "utf8",
  );
  const publicCaseChapter = await readFile(
    join(docsRoot, "bluebook/part-3/09-public-case-atlas.md"),
    "utf8",
  );

  assert.match(caseIndex, /当前可阅读：2 个具名客户深度案例（4 个业务场景）\+ 32 个公开场景案例/);
  assert.match(caseIndex, /客户陈述|独立审计|证据边界/);
  assert.match(pisenCase, /^# 品胜电子：竞品调研与产品物料制作/m);
  assert.match(pisenCase, /客户陈述结果/);
  assert.match(youkelaCase, /^# 优克拉：产品研发与考勤算薪/m);
  assert.match(youkelaCase, /客户陈述结果/);
  assert.match(publicCaseAtlas, /^# 千问办公公开案例库：32 个场景图谱/m);
  assert.match(publicCaseAtlas, /32 个场景/);
  assert.match(publicCaseAtlas, /证据边界|待核验/);
  assert.match(publicCaseChapter, /## 可阅读案例/);
  assert.match(publicCaseChapter, /\/cases\//);
});
