import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  containsSensitivePattern,
  parseFrontmatter,
  REQUIRED_CASE_SECTIONS,
  validateCaseBody,
  validateEvidenceLedger,
  validatePageMeta,
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
