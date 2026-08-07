import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmod,
  copyFile,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import {
  buildPrintDocument,
  resolveDocumentLink,
  validateManifest,
} from "../scripts/build-bluebook-print.mjs";
import { generateEvidencePages } from "../scripts/generate-evidence-pages.mjs";
import { validateCaseDirectory } from "../scripts/validate-cases.mjs";
import {
  validateContentRoots,
  validateEvidenceRepository,
} from "../scripts/validate-content.mjs";
import validCaseMap from "./fixtures/evidence/case-map-valid-32.mjs";

const fixturesDirectory = new URL("./fixtures/", import.meta.url);
const execFileAsync = promisify(execFile);

async function createTemporaryDirectory(t) {
  const directory = await mkdtemp(join(tmpdir(), "qwenwork-validators-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

async function createFakeChrome(
  directory,
  exitCode = 0,
  writePdf = true,
  version = "150.0.0.0",
) {
  const chrome = join(directory, "Fake Chrome");
  const source = `#!/bin/sh
if [ "$1" = "--version" ]; then
  echo "Fake Chrome ${version}"
  exit 0
fi
output=""
for argument in "$@"; do
  case "$argument" in
    --print-to-pdf=*) output="\${argument#--print-to-pdf=}" ;;
  esac
done
${writePdf ? 'printf "%s" "%PDF-1.4 fake" > "$output"' : ":"}
exit ${exitCode}
`;
  await writeFile(chrome, source, "utf8");
  await chmod(chrome, 0o755);
  return chrome;
}

async function writeExecutable(path, source) {
  await writeFile(path, source, "utf8");
  await chmod(path, 0o755);
}

async function createFakePdfRepository(t) {
  const root = await mkdtemp(join(tmpdir(), "qwenwork-pdf-repo-"));
  const bin = join(root, "bin");
  const tmp = join(root, "tmp");
  const output = join(
    root,
    "docs/public/downloads/qwenwork-bluebook-v2.0.pdf",
  );
  await mkdir(bin, { recursive: true });
  await mkdir(tmp, { recursive: true });
  await mkdir(join(root, "scripts"), { recursive: true });
  await mkdir(join(root, "docs/public/downloads"), { recursive: true });
  await copyFile(
    new URL("../scripts/build-bluebook-pdf.sh", import.meta.url),
    join(root, "scripts/build-bluebook-pdf.sh"),
  );
  await writeExecutable(
    join(root, "scripts/html-to-pdf.sh"),
    `#!/bin/sh
if [ "$1" = "--check" ]; then
  echo "Fake Chrome 150.0.0.0"
  exit 0
fi
last=""
for argument in "$@"; do last="$argument"; done
printf "%s" "%PDF-1.4 new" > "$last"
`,
  );
  await writeExecutable(
    join(bin, "node"),
    `#!/bin/sh
if [ "$1" = "--version" ]; then echo "v22.0.0"; exit 0; fi
output=""
previous=""
for argument in "$@"; do
  if [ "$previous" = "--output" ]; then output="$argument"; fi
  previous="$argument"
done
if [ -n "$output" ]; then printf "%s" "<!doctype html><title>V2.0</title>" > "$output"; fi
`,
  );
  await writeExecutable(
    join(bin, "npm"),
    `#!/bin/sh
if [ "$1" = "--version" ]; then echo "10.0.0"; fi
exit 0
`,
  );
  await writeExecutable(
    join(bin, "pdfinfo"),
    `#!/bin/sh
if [ "$1" = "-v" ]; then echo "pdfinfo version 24.02" >&2; exit 0; fi
if [ "\${QWG_FAKE_PDFINFO_MODE:-valid}" = "invalid" ]; then
  printf "%s\\n" "Title: invalid" "Pages: 0"
else
  printf "%s\\n" "Title: 千问办公蓝皮书 V2.0" "Pages: 2"
fi
`,
  );
  await writeExecutable(
    join(bin, "pdftoppm"),
    `#!/bin/sh
if [ "$1" = "-v" ]; then echo "pdftoppm version 24.02" >&2; exit 0; fi
prefix=""
for argument in "$@"; do prefix="$argument"; done
pages="\${QWG_FAKE_RENDERED_PAGES:-2}"
i=1
while [ "$i" -le "$pages" ]; do
  printf "%s" "png" > "$prefix-$i.png"
  i=$((i + 1))
done
`,
  );
  t.after(() => rm(root, { recursive: true, force: true }));
  return { root, bin, tmp, output };
}

async function runFakePdfBuild(t, options = {}) {
  const {
    previous = "previous",
    pdfinfoMode = "valid",
    renderedPages = "2",
  } = options;
  const fixture = await createFakePdfRepository(t);
  await writeFile(fixture.output, previous, "utf8");
  const execution = execFileAsync(
    "bash",
    ["scripts/build-bluebook-pdf.sh"],
    {
      cwd: fixture.root,
      env: {
        ...process.env,
        PATH: `${fixture.bin}:${process.env.PATH}`,
        TMPDIR: fixture.tmp,
        QWG_FAKE_PDFINFO_MODE: pdfinfoMode,
        QWG_FAKE_RENDERED_PAGES: renderedPages,
      },
    },
  );
  return { ...fixture, execution };
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

test("validateEvidenceRepository aggregates structured and Markdown failures", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const contentRoot = join(directory, "docs");
  const dataRoot = join(contentRoot, "bluebook/data");
  await mkdir(dataRoot, { recursive: true });
  await mkdir(join(contentRoot, "bluebook/appendices"), { recursive: true });
  await mkdir(join(contentRoot, "cases"), { recursive: true });
  const ledger = JSON.parse(
    await readFile(
      new URL("fixtures/evidence/ledger-valid.json", import.meta.url),
      "utf8",
    ),
  );
  const snapshotContent = "public source snapshot\n";
  const snapshotPath = "docs/public/evidence-snapshots/source.txt";
  ledger.claims[0].source.snapshot_path = snapshotPath;
  ledger.claims[0].source.content_hash = `sha256:${createHash("sha256")
    .update(snapshotContent)
    .digest("hex")}`;
  await mkdir(join(directory, "docs/public/evidence-snapshots"), {
    recursive: true,
  });
  await writeFile(join(directory, snapshotPath), snapshotContent, "utf8");
  await writeFile(
    join(dataRoot, "evidence-ledger.json"),
    JSON.stringify(ledger, null, 2),
    "utf8",
  );
  await writeFile(
    join(dataRoot, "case-source-map.json"),
    JSON.stringify(validCaseMap, null, 2),
    "utf8",
  );
  await writeFile(
    join(contentRoot, "bluebook/executive-summary.md"),
    '---\ntitle: 摘要\nstatus: community-practice\n---\n\n# 摘要\n\n<span id="claim-workflow-core-01" data-claim-id="claim-workflow-core-01"></span>本书主张：企业采用 AI 应关注工作流。\n',
    "utf8",
  );
  await writeFile(
    join(contentRoot, "bluebook/appendices/sources.md"),
    await readFile(
      new URL("fixtures/evidence/sources-valid-aliases.md", import.meta.url),
    ),
  );
  await writeFile(
    join(contentRoot, "cases/index.md"),
    '<span data-public-case-count="0">0</span> 个公开案例\n',
    "utf8",
  );

  const options = {
    repositoryRoot: directory,
    evidenceLedgerPath: join(dataRoot, "evidence-ledger.json"),
    caseSourceMapPath: join(dataRoot, "case-source-map.json"),
    contentRoots: [contentRoot],
    executiveSummaryPath: join(
      contentRoot,
      "bluebook/executive-summary.md",
    ),
    sourcesPath: join(contentRoot, "bluebook/appendices/sources.md"),
    publicCaseCountPaths: [join(contentRoot, "cases/index.md")],
    publicCaseMembershipPath: null,
    today: "2026-08-01",
  };
  assert.deepEqual(await validateEvidenceRepository(options), []);

  await writeFile(join(directory, snapshotPath), "tampered\n", "utf8");
  assert.ok(
    (await validateEvidenceRepository(options)).some((failure) =>
      failure.includes("snapshot hash 不匹配"),
    ),
  );
  await writeFile(join(directory, snapshotPath), snapshotContent, "utf8");
  ledger.claims[0].source.snapshot_path =
    "docs/public/evidence-snapshots/missing.txt";
  await writeFile(
    join(dataRoot, "evidence-ledger.json"),
    JSON.stringify(ledger, null, 2),
    "utf8",
  );
  assert.ok(
    (await validateEvidenceRepository(options)).some((failure) =>
      failure.includes("snapshot 文件不存在或不可读"),
    ),
  );
  ledger.claims[0].source.snapshot_path = snapshotPath;
  await writeFile(
    join(dataRoot, "evidence-ledger.json"),
    JSON.stringify(ledger, null, 2),
    "utf8",
  );

  await writeFile(
    join(contentRoot, "bluebook/executive-summary.md"),
    "---\ntitle: 摘要\nstatus: community-practice\n---\n\n# 摘要\n\n没有主张标记。\n",
    "utf8",
  );
  await writeFile(
    join(contentRoot, "cases/index.md"),
    '<span data-public-case-count="1">1</span> 个公开案例\n',
    "utf8",
  );
  const failures = await validateEvidenceRepository(options);
  assert.ok(
    failures.some((failure) =>
      failure.includes("执行摘要未关联 claim_id"),
    ),
  );
  assert.ok(
    failures.some((failure) => failure.includes("公开案例计数")),
  );

  await writeFile(
    join(contentRoot, "bluebook/executive-summary.md"),
    "---\ntitle: 摘要\nstatus: community-practice\n\n# 未闭合 Frontmatter\n",
    "utf8",
  );
  const parseFailures = await validateEvidenceRepository(options);
  assert.ok(
    parseFailures.some((failure) => failure.includes("Frontmatter 未闭合")),
  );
  assert.ok(
    parseFailures.some((failure) => failure.includes("公开案例计数")),
  );
});

test("validateEvidenceRepository aggregates invalid object shapes without throwing", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const contentRoot = join(directory, "docs");
  const dataRoot = join(contentRoot, "bluebook/data");
  await mkdir(dataRoot, { recursive: true });
  await mkdir(join(contentRoot, "bluebook/appendices"), { recursive: true });
  await writeFile(
    join(dataRoot, "evidence-ledger.json"),
    '{"schema_version":1,"claims":null}',
    "utf8",
  );
  await writeFile(
    join(dataRoot, "case-source-map.json"),
    '{"schema_version":1,"cases":null}',
    "utf8",
  );
  await writeFile(
    join(contentRoot, "bluebook/appendices/sources.md"),
    await readFile(
      new URL("fixtures/evidence/sources-valid-aliases.md", import.meta.url),
    ),
  );
  const options = {
    repositoryRoot: directory,
    evidenceLedgerPath: join(dataRoot, "evidence-ledger.json"),
    caseSourceMapPath: join(dataRoot, "case-source-map.json"),
    contentRoots: [contentRoot],
    executiveSummaryPath: join(
      contentRoot,
      "bluebook/executive-summary.md",
    ),
    sourcesPath: join(contentRoot, "bluebook/appendices/sources.md"),
    publicCaseCountPaths: [],
    publicCaseMembershipPath: null,
    today: "2026-08-01",
  };
  const failures = await validateEvidenceRepository(options);
  assert.ok(
    failures.some((failure) => failure.includes("claims 必须为数组")),
  );
  assert.ok(
    failures.some((failure) => failure.includes("cases 必须为数组")),
  );

  const ledger = JSON.parse(
    await readFile(
      new URL("fixtures/evidence/ledger-valid.json", import.meta.url),
      "utf8",
    ),
  );
  const caseMap = structuredClone(validCaseMap);
  ledger.claims[0] = null;
  caseMap.cases[0] = null;
  await writeFile(
    join(dataRoot, "evidence-ledger.json"),
    JSON.stringify(ledger),
    "utf8",
  );
  await writeFile(
    join(dataRoot, "case-source-map.json"),
    JSON.stringify(caseMap),
    "utf8",
  );
  const nestedFailures = await validateEvidenceRepository(options);
  assert.ok(
    nestedFailures.some((failure) =>
      failure.includes("claims[0]: 必须为对象"),
    ),
  );
  assert.ok(
    nestedFailures.some((failure) =>
      failure.includes("cases[0]: 必须为对象"),
    ),
  );
});

test("validateManifest accepts only ordered bluebook documents", async () => {
  const manifest = JSON.parse(
    await readFile(
      new URL("fixtures/pdf/manifest-valid.json", import.meta.url),
      "utf8",
    ),
  );
  const availablePaths = new Set(manifest.items.map((item) => item.path));
  assert.deepEqual(
    validateManifest(manifest, { availablePaths, expectedCount: 2 }),
    [],
  );
  manifest.items[1].path = "../outside.md";
  assert.ok(
    validateManifest(manifest, { availablePaths, expectedCount: 2 }).some(
      (error) => error.includes("docs/bluebook"),
    ),
  );
});

test("Official Manifest contains the exact ordered 21-item sequence", async () => {
  const manifest = JSON.parse(
    await readFile(
      new URL("../scripts/bluebook-v2-manifest.json", import.meta.url),
      "utf8",
    ),
  );
  const actual = manifest.items.map(({ id, path, kind }) => ({
    id,
    path,
    kind,
  }));
  assert.deepEqual(actual, [
    { id: "executive-summary", path: "docs/bluebook/executive-summary.md", kind: "executive-summary" },
    { id: "chapter-01", path: "docs/bluebook/part-1/01-delivery-standard.md", kind: "chapter" },
    { id: "chapter-02", path: "docs/bluebook/part-1/02-task-delivery-protocol.md", kind: "chapter" },
    { id: "chapter-03", path: "docs/bluebook/part-2/03-work-environment-architecture.md", kind: "chapter" },
    { id: "chapter-04", path: "docs/bluebook/part-2/04-skills-connectors-expert-kits.md", kind: "chapter" },
    { id: "chapter-05", path: "docs/bluebook/part-2/05-automation-boundaries.md", kind: "chapter" },
    { id: "chapter-06", path: "docs/bluebook/part-3/06-office-delivery.md", kind: "chapter" },
    { id: "chapter-07", path: "docs/bluebook/part-3/07-role-roadmaps.md", kind: "chapter" },
    { id: "chapter-08", path: "docs/bluebook/part-3/08-research-evidence-chain.md", kind: "chapter" },
    { id: "chapter-09", path: "docs/bluebook/part-3/09-public-case-atlas.md", kind: "chapter" },
    { id: "chapter-10", path: "docs/bluebook/part-4/10-pilot-roadmap.md", kind: "chapter" },
    { id: "chapter-11", path: "docs/bluebook/part-4/11-security-governance.md", kind: "chapter" },
    { id: "chapter-12", path: "docs/bluebook/part-4/12-workflow-operations.md", kind: "chapter" },
    { id: "chapter-13", path: "docs/bluebook/part-4/13-value-measurement.md", kind: "chapter" },
    { id: "conclusion", path: "docs/bluebook/conclusion-product-ecosystem.md", kind: "conclusion" },
    { id: "appendix-prompts", path: "docs/bluebook/appendices/prompt-templates.md", kind: "appendix" },
    { id: "appendix-scenarios", path: "docs/bluebook/appendices/scenario-index.md", kind: "appendix" },
    { id: "appendix-launch", path: "docs/bluebook/appendices/launch-checklist.md", kind: "appendix" },
    { id: "appendix-sources", path: "docs/bluebook/appendices/sources.md", kind: "appendix" },
    { id: "appendix-evidence", path: "docs/bluebook/appendices/evidence-ledger.md", kind: "appendix" },
    { id: "appendix-cases", path: "docs/bluebook/appendices/case-source-map.md", kind: "appendix" },
  ]);
});

test("resolveDocumentLink namespaces headings but preserves globally unique raw IDs", () => {
  const context = {
    currentPath: "docs/bluebook/chapter-a.md",
    currentId: "chapter-a",
    documentsByPath: new Map([
      [
        "docs/bluebook/chapter-b.md",
        {
          id: "chapter-b",
          headingAnchors: new Set(["same-heading"]),
          rawAnchors: new Set(["r14"]),
        },
      ],
      [
        "docs/bluebook/appendices/sources.md",
        {
          id: "appendix-sources",
          headingAnchors: new Set(),
          rawAnchors: new Set(["r15"]),
        },
      ],
    ]),
    currentHeadingAnchors: new Set(["local-heading"]),
    currentRawAnchors: new Set(["claim-print-a-01"]),
    siteBaseUrl: "https://qwenworkguide.pages.dev/",
  };
  assert.equal(
    resolveDocumentLink("#local-heading", context),
    "#chapter-a--local-heading",
  );
  assert.equal(
    resolveDocumentLink("#claim-print-a-01", context),
    "#claim-print-a-01",
  );
  assert.equal(
    resolveDocumentLink("chapter-b.md#same-heading", context),
    "#chapter-b--same-heading",
  );
  assert.equal(resolveDocumentLink("chapter-b.md#r14", context), "#r14");
  assert.equal(
    resolveDocumentLink("appendices/sources.md#r15", context),
    "#r15",
  );
  assert.equal(
    resolveDocumentLink("https://example.com/x", context),
    "https://example.com/x",
  );
});

test("buildPrintDocument strips frontmatter and renders VitePress Markdown", async () => {
  const manifest = JSON.parse(
    await readFile(
      new URL("fixtures/pdf/manifest-valid.json", import.meta.url),
      "utf8",
    ),
  );
  const html = await buildPrintDocument({
    repoRoot: fileURLToPath(new URL("fixtures/pdf/repo/", import.meta.url)),
    manifest,
    css: "@page { size: A4; }",
  });
  assert.match(html, /<title>千问办公蓝皮书 V2\.0<\/title>/);
  assert.match(html, /class="warning custom-block"/);
  assert.match(html, /id="chapter-a--same-heading"/);
  assert.match(html, /id="claim-print-a-01"/);
  assert.doesNotMatch(html, /id="chapter-a--claim-print-a-01"/);
  assert.match(html, /href="#chapter-b--same-heading"/);
  assert.match(html, /<a href="#claim-print-a-01">同章原始锚点<\/a>/);
  assert.match(html, /id="r14"/);
  assert.match(html, /<a href="#r14">跨章原始锚点<\/a>/);
  assert.doesNotMatch(html, /^---$/m);
});

test("print stylesheet covers pagination and overflow contracts", async () => {
  const css = await readFile(
    new URL("../docs/.vitepress/theme/print.css", import.meta.url),
    "utf8",
  );
  for (const pattern of [
    /@page\s*{[^}]*size:\s*A4/s,
    /print-color-adjust:\s*exact/,
    /break-before:\s*page/,
    /thead\s*{[^}]*table-header-group/s,
    /overflow-wrap:\s*anywhere/,
    /white-space:\s*pre-wrap/,
    /\.custom-block\.warning/,
    /img\s*{[^}]*max-height:\s*240mm/s,
    /counter\(page\)/,
  ]) {
    assert.match(css, pattern);
  }
  assert.doesNotMatch(
    css,
    /(?:^|\n)\s*(?:tr|th|td)(?:\s*,\s*(?:tr|th|td))*\s*{[^}]*break-inside:\s*avoid/s,
  );
});

test("html-to-pdf prefers explicit Chrome and replaces output atomically", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const chrome = await createFakeChrome(directory);
  const input = join(directory, "input file.html");
  const output = join(directory, "output file.pdf");
  await writeFile(input, "<!doctype html><title>V2.0</title>", "utf8");
  await writeFile(output, "old", "utf8");
  await execFileAsync("bash", [
    "scripts/html-to-pdf.sh",
    "--chrome",
    chrome,
    input,
    output,
  ]);
  assert.equal(await readFile(output, "utf8"), "%PDF-1.4 fake");
});

test("html-to-pdf preserves the previous PDF when Chrome fails", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const chrome = await createFakeChrome(directory, 9, false);
  const input = join(directory, "input.html");
  const output = join(directory, "output.pdf");
  await writeFile(input, "<!doctype html><title>V2.0</title>", "utf8");
  await writeFile(output, "previous", "utf8");
  await assert.rejects(
    execFileAsync("bash", [
      "scripts/html-to-pdf.sh",
      "--chrome",
      chrome,
      input,
      output,
    ]),
  );
  assert.equal(await readFile(output, "utf8"), "previous");
});

test("html-to-pdf rejects empty browser output", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const chrome = await createFakeChrome(directory, 0, false);
  const input = join(directory, "input.html");
  const output = join(directory, "output.pdf");
  await writeFile(input, "<!doctype html><title>V2.0</title>", "utf8");
  await assert.rejects(
    execFileAsync("bash", [
      "scripts/html-to-pdf.sh",
      "--chrome",
      chrome,
      input,
      output,
    ]),
  );
});

test("html-to-pdf uses QWG_CHROME_BIN when no explicit path is supplied", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const chrome = await createFakeChrome(directory);
  const input = join(directory, "input.html");
  const output = join(directory, "output.pdf");
  await writeFile(input, "<!doctype html><title>V2.0</title>", "utf8");
  await execFileAsync("bash", ["scripts/html-to-pdf.sh", input, output], {
    env: { ...process.env, QWG_CHROME_BIN: chrome },
  });
  assert.equal(await readFile(output, "utf8"), "%PDF-1.4 fake");
});

test("html-to-pdf rejects an invalid explicit Chrome without fallback", async (t) => {
  const directory = await createTemporaryDirectory(t);
  await assert.rejects(
    execFileAsync("bash", [
      "scripts/html-to-pdf.sh",
      "--check",
      "--chrome",
      join(directory, "missing"),
    ], { env: { ...process.env, QWG_CHROME_BIN: "" } }),
  );
});

test("html-to-pdf rejects an invalid QWG_CHROME_BIN without fallback", async (t) => {
  const directory = await createTemporaryDirectory(t);
  await assert.rejects(
    execFileAsync("bash", ["scripts/html-to-pdf.sh", "--check"], {
      env: { ...process.env, QWG_CHROME_BIN: join(directory, "missing") },
    }),
  );
});

test("html-to-pdf requires Chrome major version 131 or newer", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const chrome = await createFakeChrome(directory, 0, true, "130.0.0.0");
  await assert.rejects(
    execFileAsync("bash", [
      "scripts/html-to-pdf.sh",
      "--check",
      "--chrome",
      chrome,
    ]),
  );
});

test("build-bluebook-pdf success replaces the previous output", async (t) => {
  const { output, execution } = await runFakePdfBuild(t);
  await execution;
  assert.equal(await readFile(output, "utf8"), "%PDF-1.4 new");
  assert.deepEqual(
    (await readdir(join(dirname(output)))).filter((name) =>
      name.startsWith(".qwenwork-bluebook-v2.0.pdf."),
    ),
    [],
  );
});

test("build-bluebook-pdf invalid pdfinfo preserves the previous output", async (t) => {
  const { output, execution } = await runFakePdfBuild(t, {
    pdfinfoMode: "invalid",
  });
  await assert.rejects(execution);
  assert.equal(await readFile(output, "utf8"), "previous");
  assert.deepEqual(
    (await readdir(join(dirname(output)))).filter((name) =>
      name.startsWith(".qwenwork-bluebook-v2.0.pdf."),
    ),
    [],
  );
});

test("build-bluebook-pdf page-count failure preserves the previous output", async (t) => {
  const { output, execution } = await runFakePdfBuild(t, {
    renderedPages: "1",
  });
  await assert.rejects(execution);
  assert.equal(await readFile(output, "utf8"), "previous");
  assert.deepEqual(
    (await readdir(join(dirname(output)))).filter((name) =>
      name.startsWith(".qwenwork-bluebook-v2.0.pdf."),
    ),
    [],
  );
});
