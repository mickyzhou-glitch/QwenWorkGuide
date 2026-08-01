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

import { generateEvidencePages } from "../scripts/generate-evidence-pages.mjs";
import { validateCaseDirectory } from "../scripts/validate-cases.mjs";
import { validateContentRoots } from "../scripts/validate-content.mjs";
import validCaseMap from "./fixtures/evidence/case-map-valid-32.mjs";

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

test("generateEvidencePages writes deterministic public appendices", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const ledgerPath = join(directory, "evidence-ledger.json");
  const caseMapPath = join(directory, "case-source-map.json");
  const evidenceOutputPath = join(directory, "evidence-ledger.md");
  const caseOutputPath = join(directory, "case-source-map.md");
  const ledger = JSON.parse(
    await readFile(
      new URL("fixtures/evidence/ledger-valid.json", import.meta.url),
      "utf8",
    ),
  );
  ledger.claims.push({
    ...structuredClone(ledger.claims[0]),
    claim_id: "claim-public-safe-lead-01",
    claim_text: "公开安全且不可反推主体身份的待核验线索。",
    content_path: null,
    content_anchor: null,
    is_key: false,
    summary_eligible: false,
    blocks_release: false,
    verification_status: "pending",
  });
  const caseMap = structuredClone(validCaseMap);
  Object.assign(caseMap.cases[0], {
    original_name: "公开案例 | 第一行\n第二行",
    verification_status: "limited",
    included_in_public_count: true,
    external_record_id: "external-case-record-001",
    deep_link: null,
    snapshot_path: "docs/public/evidence-snapshots/case-001.html",
    content_hash: `sha256:${"b".repeat(64)}`,
    artifact_links: ["https://artifact.example/demo-001"],
    limitations: ["样本和外推范围有限。"],
  });
  await writeFile(ledgerPath, JSON.stringify(ledger, null, 2), "utf8");
  await writeFile(caseMapPath, JSON.stringify(caseMap, null, 2), "utf8");

  assert.deepEqual(
    await generateEvidencePages({
      ledgerPath,
      caseMapPath,
      evidenceOutputPath,
      caseOutputPath,
      mode: "write",
      today: "2026-08-01",
    }),
    [],
  );
  const first = [
    await readFile(evidenceOutputPath, "utf8"),
    await readFile(caseOutputPath, "utf8"),
  ];
  assert.match(
    first[0],
    /## 已发布主张[\s\S]*claim-workflow-core-01/,
  );
  assert.match(
    first[0],
    /## 待核验线索（公开安全）[\s\S]*claim-public-safe-lead-01/,
  );
  assert.ok(
    first[0].includes(
      "[docs/bluebook/executive-summary.md#claim-workflow-core-01](/bluebook/executive-summary#claim-workflow-core-01)",
    ),
  );
  assert.match(first[1], /公开案例：1；待核验线索：31/);
  assert.ok(first[1].includes("公开案例 \\| 第一行<br>第二行"));
  assert.ok(
    first[1].includes(
      "[docs/public/evidence-snapshots/case-001.html](/evidence-snapshots/case-001.html)",
    ),
  );
  assert.deepEqual(
    await generateEvidencePages({
      ledgerPath,
      caseMapPath,
      evidenceOutputPath,
      caseOutputPath,
      mode: "write",
      today: "2026-08-01",
    }),
    [],
  );
  assert.deepEqual(
    [
      await readFile(evidenceOutputPath, "utf8"),
      await readFile(caseOutputPath, "utf8"),
    ],
    first,
  );
});

test("generateEvidencePages check mode reports stale generated pages without writing", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const ledgerPath = join(directory, "evidence-ledger.json");
  const caseMapPath = join(directory, "case-source-map.json");
  const evidenceOutputPath = join(directory, "evidence-ledger.md");
  const caseOutputPath = join(directory, "case-source-map.md");
  await writeFile(
    ledgerPath,
    await readFile(
      new URL("fixtures/evidence/ledger-valid.json", import.meta.url),
    ),
    "utf8",
  );
  await writeFile(caseMapPath, JSON.stringify(validCaseMap, null, 2), "utf8");
  await writeFile(evidenceOutputPath, "过期内容\n", "utf8");
  await writeFile(caseOutputPath, "过期内容\n", "utf8");
  const failures = await generateEvidencePages({
    ledgerPath,
    caseMapPath,
    evidenceOutputPath,
    caseOutputPath,
    mode: "check",
    today: "2026-08-01",
  });
  assert.equal(await readFile(evidenceOutputPath, "utf8"), "过期内容\n");
  assert.ok(
    failures.some((failure) => failure.includes("evidence-ledger.md")),
  );
});

test("generateEvidencePages aggregates invalid JSON and schema errors without outputs", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const ledgerPath = join(directory, "evidence-ledger.json");
  const caseMapPath = join(directory, "case-source-map.json");
  const evidenceOutputPath = join(directory, "evidence-ledger.md");
  const caseOutputPath = join(directory, "case-source-map.md");
  await writeFile(
    ledgerPath,
    '{"schema_version":1,"claims":null}',
    "utf8",
  );
  await writeFile(caseMapPath, "{invalid", "utf8");
  const failures = await generateEvidencePages({
    ledgerPath,
    caseMapPath,
    evidenceOutputPath,
    caseOutputPath,
    mode: "write",
    today: "2026-08-01",
  });
  assert.ok(
    failures.some((failure) => failure.includes("claims 必须为数组")),
  );
  assert.ok(
    failures.some((failure) => failure.includes("case-source-map.json")),
  );
  await assert.rejects(readFile(evidenceOutputPath, "utf8"));
  await assert.rejects(readFile(caseOutputPath, "utf8"));
});
