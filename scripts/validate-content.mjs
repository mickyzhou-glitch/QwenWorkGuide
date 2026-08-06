import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

import {
  containsSensitivePattern,
  parseFrontmatter,
  validateCaseSourceMap,
  validateClaimReferences,
  validateEvidenceLedger,
  validatePageMeta,
  validatePublicCaseCountReferences,
  validatePublicCaseMembership,
  validateSourceCatalog,
  validateSourceReferences,
} from "./content-utils.mjs";

const CONTENT_DIRECTORIES = [
  "docs/bluebook",
  "docs/guides",
  "docs/community",
  "docs/cases",
];

function displayPath(path) {
  return relative(process.cwd(), path) || path;
}

async function findMarkdownFiles(directory, failures) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    failures.push(`${displayPath(directory)}: ${error.message}`);
    return [];
  }

  const files = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findMarkdownFiles(path, failures)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(path);
    }
  }

  return files;
}

export async function validateContentRoots(roots) {
  const failures = [];
  const files = [];

  for (const root of roots) {
    files.push(...(await findMarkdownFiles(root, failures)));
  }

  for (const file of files.sort()) {
    let source;
    try {
      source = await readFile(file, "utf8");
    } catch (error) {
      failures.push(`${displayPath(file)}: ${error.message}`);
      continue;
    }
    const path = displayPath(file);

    try {
      const { attributes } = parseFrontmatter(source);
      for (const error of validatePageMeta(attributes)) {
        failures.push(`${path}: ${error}`);
      }
    } catch (error) {
      failures.push(`${path}: ${error.message}`);
    }

    if (containsSensitivePattern(source)) {
      failures.push(`${path}: 检测到疑似密钥或敏感凭证`);
    }
  }

  return failures;
}

async function readJsonForValidation(path, failures) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    failures.push(`${displayPath(path)}: ${error.message}`);
    return undefined;
  }
}

async function readTextForValidation(path, failures) {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    failures.push(`${displayPath(path)}: ${error.message}`);
    return null;
  }
}

async function validateSnapshotReferences({ repositoryRoot, ledger, caseMap }) {
  const errors = [];
  const records = [
    ...(ledger?.claims ?? []).flatMap((claim) =>
      claim.source.snapshot_path === null
        ? []
        : [
            [
              claim.claim_id,
              claim.source.snapshot_path,
              claim.source.content_hash,
            ],
          ],
    ),
    ...(caseMap?.cases ?? []).flatMap((item) =>
      item.snapshot_path === null
        ? []
        : [[item.case_id, item.snapshot_path, item.content_hash]],
    ),
  ];
  const allowedRoot = resolve(repositoryRoot, "docs/public/evidence-snapshots");
  for (const [owner, snapshotPath, expectedHash] of records) {
    const absolutePath = resolve(repositoryRoot, snapshotPath);
    const relativeToAllowed = relative(allowedRoot, absolutePath);
    if (
      relativeToAllowed === "" ||
      relativeToAllowed === ".." ||
      relativeToAllowed.startsWith(`..${sep}`) ||
      isAbsolute(relativeToAllowed)
    ) {
      errors.push(`${owner}: snapshot_path 不在公开快照目录内`);
      continue;
    }
    let bytes;
    try {
      bytes = await readFile(absolutePath);
    } catch (error) {
      errors.push(`${owner}: snapshot 文件不存在或不可读：${error.message}`);
      continue;
    }
    const actualHash = `sha256:${createHash("sha256")
      .update(bytes)
      .digest("hex")}`;
    if (actualHash !== expectedHash) {
      errors.push(`${owner}: snapshot hash 不匹配`);
    }
  }
  return errors;
}

export async function validateEvidenceRepository({
  repositoryRoot,
  evidenceLedgerPath,
  caseSourceMapPath,
  contentRoots,
  executiveSummaryPath,
  sourcesPath,
  publicCaseCountPaths,
  publicCaseMembershipPath,
  today,
}) {
  const failures = [];
  const toRepositoryPath = (path) => {
    const relativePath = relative(resolve(repositoryRoot), resolve(path));
    if (
      relativePath === "" ||
      relativePath === ".." ||
      relativePath.startsWith(`..${sep}`) ||
      isAbsolute(relativePath)
    ) {
      failures.push(`${displayPath(path)}: 路径不在 repositoryRoot 内`);
      return null;
    }
    return relativePath.split(sep).join("/");
  };

  const ledger = await readJsonForValidation(evidenceLedgerPath, failures);
  const caseMap = await readJsonForValidation(caseSourceMapPath, failures);
  const ledgerErrors =
    ledger === undefined ? [] : validateEvidenceLedger(ledger, { today });
  const caseMapErrors =
    caseMap === undefined ? [] : validateCaseSourceMap(caseMap);
  failures.push(...ledgerErrors, ...caseMapErrors);
  const ledgerUsable = ledger !== undefined && ledgerErrors.length === 0;
  const caseMapUsable = caseMap !== undefined && caseMapErrors.length === 0;

  const markdownFiles = [];
  for (const root of contentRoots) {
    markdownFiles.push(...(await findMarkdownFiles(root, failures)));
  }
  const documents = new Map();
  for (const file of markdownFiles) {
    const source = await readTextForValidation(file, failures);
    const repositoryPath = toRepositoryPath(file);
    if (source !== null && repositoryPath !== null) {
      documents.set(repositoryPath, source);
    }
  }
  if (ledgerUsable) {
    failures.push(
      ...validateClaimReferences({
        ledger,
        documents,
        executiveSummaryPath: toRepositoryPath(executiveSummaryPath),
      }),
    );
  }

  const sources = await readTextForValidation(sourcesPath, failures);
  if (sources !== null) {
    const allowedAliases = new Map([
      ["R14", "R8"],
      ["R15", "R4"],
    ]);
    failures.push(...validateSourceCatalog(sources, { allowedAliases }));
    failures.push(
      ...validateSourceReferences({
        ledger: ledgerUsable ? ledger : undefined,
        caseMap: caseMapUsable ? caseMap : undefined,
        source: sources,
        allowedAliases,
      }),
    );
  }
  failures.push(
    ...(await validateSnapshotReferences({
      repositoryRoot,
      ledger: ledgerUsable ? ledger : undefined,
      caseMap: caseMapUsable ? caseMap : undefined,
    })),
  );

  const countDocuments = new Map();
  for (const path of publicCaseCountPaths) {
    const source = await readTextForValidation(path, failures);
    const repositoryPath = toRepositoryPath(path);
    if (source !== null && repositoryPath !== null) {
      countDocuments.set(repositoryPath, source);
    }
  }
  if (caseMapUsable) {
    failures.push(
      ...validatePublicCaseCountReferences(
        countDocuments,
        caseMap.cases.filter((item) => item.included_in_public_count).length,
      ),
    );
  }
  if (publicCaseMembershipPath !== null && caseMapUsable) {
    const source = await readTextForValidation(
      publicCaseMembershipPath,
      failures,
    );
    if (source !== null) {
      failures.push(...validatePublicCaseMembership(source, caseMap));
    }
  }
  return failures;
}

async function runCli() {
  const repositoryRoot = process.cwd();
  const evidenceContentRoots = [
    "docs/bluebook",
    "docs/guides",
    "docs/community",
    "docs/cases",
  ];
  const failures = [
    ...(await validateContentRoots(CONTENT_DIRECTORIES)),
    ...(await validateEvidenceRepository({
      repositoryRoot,
      evidenceLedgerPath: resolve("docs/bluebook/data/evidence-ledger.json"),
      caseSourceMapPath: resolve("docs/bluebook/data/case-source-map.json"),
      contentRoots: evidenceContentRoots.map((path) => resolve(path)),
      executiveSummaryPath: resolve("docs/bluebook/executive-summary.md"),
      sourcesPath: resolve("docs/bluebook/appendices/sources.md"),
      publicCaseCountPaths: [
        resolve("docs/bluebook/part-3/09-public-case-atlas.md"),
        resolve("docs/cases/index.md"),
        resolve("docs/cases/submissions/qwenwork-public-case-atlas.md"),
      ],
      publicCaseMembershipPath: resolve(
        "docs/bluebook/part-3/09-public-case-atlas.md",
      ),
      today: new Date().toISOString().slice(0, 10),
    })),
  ];

  if (failures.length > 0) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
    return;
  }

  console.log("正式内容校验通过");
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  runCli().catch((error) => {
    console.error(`正式内容校验失败：${error.message}`);
    process.exitCode = 1;
  });
}
