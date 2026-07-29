import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  containsSensitivePattern,
  parseFrontmatter,
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

test("containsSensitivePattern detects common secret formats", () => {
  assert.equal(
    containsSensitivePattern("token=ghp_1234567890abcdef"),
    true,
  );
  assert.equal(containsSensitivePattern("这是普通内容"), false);
});
