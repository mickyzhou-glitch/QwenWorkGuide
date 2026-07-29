import test from "node:test";
import assert from "node:assert/strict";
import {
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { validateCaseDirectory } from "../scripts/validate-cases.mjs";
import { validateContentRoots } from "../scripts/validate-content.mjs";

const fixturesDirectory = new URL("./fixtures/", import.meta.url);

async function createTemporaryDirectory(t) {
  const directory = await mkdtemp(join(tmpdir(), "qwenwork-validators-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

test("validateContentRoots aggregates missing roots and recursive page errors", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const missingRoot = join(directory, "missing");
  const readableRoot = join(directory, "readable");
  const nestedDirectory = join(readableRoot, "nested");
  const invalidPage = join(nestedDirectory, "invalid.md");
  await mkdir(nestedDirectory, { recursive: true });
  await writeFile(invalidPage, "# 没有 Frontmatter\n", "utf8");

  const failures = await validateContentRoots([missingRoot, readableRoot]);

  assert.ok(
    failures.some(
      (failure) => failure.includes("missing") && failure.includes("ENOENT"),
    ),
  );
  assert.ok(
    failures.some(
      (failure) =>
        failure.includes("nested/invalid.md") &&
        failure.includes("缺少 Frontmatter 字段：title"),
    ),
  );
});

test("validateContentRoots aggregates recursive readdir and file read errors", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const blockedDirectory = join(directory, "blocked");
  const unreadablePage = join(directory, "unreadable.md");
  const invalidPage = join(directory, "invalid.md");
  await mkdir(blockedDirectory);
  await writeFile(join(blockedDirectory, "page.md"), "# blocked\n", "utf8");
  await writeFile(unreadablePage, "# unreadable\n", "utf8");
  await writeFile(invalidPage, "# invalid\n", "utf8");
  await chmod(blockedDirectory, 0o000);
  await chmod(unreadablePage, 0o000);

  let failures;
  try {
    failures = await validateContentRoots([directory]);
  } finally {
    await chmod(blockedDirectory, 0o700);
    await chmod(unreadablePage, 0o600);
  }

  assert.ok(
    failures.some(
      (failure) =>
        failure.includes("blocked") && /EACCES|EPERM/.test(failure),
    ),
  );
  assert.ok(
    failures.some(
      (failure) =>
        failure.includes("unreadable.md") && /EACCES|EPERM/.test(failure),
    ),
  );
  assert.ok(
    failures.some(
      (failure) =>
        failure.includes("invalid.md") &&
        failure.includes("缺少 Frontmatter 字段：title"),
    ),
  );
});

test("validateCaseDirectory scans only top-level Markdown submissions", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const nestedDirectory = join(directory, "nested");
  const validCase = await readFile(
    new URL("valid-case.md", fixturesDirectory),
    "utf8",
  );
  await mkdir(nestedDirectory);
  await writeFile(join(directory, "valid.md"), validCase, "utf8");
  await writeFile(
    join(directory, "README.md"),
    "password: actual-secret-value-123",
    "utf8",
  );
  await writeFile(
    join(nestedDirectory, "ignored.md"),
    "password: actual-secret-value-123",
    "utf8",
  );

  assert.deepEqual(await validateCaseDirectory(directory), []);
});

test("validateCaseDirectory detects sensitive credentials in case bodies", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const validCase = await readFile(
    new URL("valid-case.md", fixturesDirectory),
    "utf8",
  );
  await writeFile(
    join(directory, "sensitive.md"),
    `${validCase}\npassword: actual-secret-value-123\n`,
    "utf8",
  );

  const failures = await validateCaseDirectory(directory);

  assert.ok(
    failures.some(
      (failure) =>
        failure.includes("sensitive.md") &&
        failure.includes("检测到疑似密钥或敏感凭证"),
    ),
  );
});

test("validateCaseDirectory aggregates unreadable and invalid files", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const unreadableCase = join(directory, "unreadable.md");
  await writeFile(unreadableCase, "# unreadable\n", "utf8");
  await writeFile(join(directory, "invalid.md"), "# invalid\n", "utf8");
  await chmod(unreadableCase, 0o000);

  let failures;
  try {
    failures = await validateCaseDirectory(directory);
  } finally {
    await chmod(unreadableCase, 0o600);
  }

  assert.ok(
    failures.some(
      (failure) =>
        failure.includes("unreadable.md") && /EACCES|EPERM/.test(failure),
    ),
  );
  assert.ok(
    failures.some(
      (failure) =>
        failure.includes("invalid.md") &&
        failure.includes("缺少 Frontmatter 字段：title"),
    ),
  );
});
