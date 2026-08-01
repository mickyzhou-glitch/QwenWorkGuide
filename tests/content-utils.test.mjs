import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { resolveConfig } from "vitepress";

import validCaseMap from "./fixtures/evidence/case-map-valid-32.mjs";

import {
  containsSensitivePattern,
  extractClaimMarkers,
  normalizeSourceUrl,
  parseFrontmatter,
  REQUIRED_CASE_SECTIONS,
  validateCaseBody,
  validateCaseSourceMap,
  validateClaimReferences,
  validateEvidenceLedger,
  validatePageMeta,
  validatePublicCaseCountReferences,
  validatePublicCaseMembership,
  validateSourceCatalog,
  validateSourceReferences,
} from "../scripts/content-utils.mjs";

const fixturesDirectory = new URL("./fixtures/", import.meta.url);
const evidenceFixtures = new URL("./fixtures/evidence/", import.meta.url);

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
