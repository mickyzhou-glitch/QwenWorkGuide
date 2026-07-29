import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  containsSensitivePattern,
  parseFrontmatter,
  REQUIRED_CASE_SECTIONS,
  validateCaseBody,
  validatePageMeta,
} from "../scripts/content-utils.mjs";

const fixturesDirectory = new URL("./fixtures/", import.meta.url);

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
