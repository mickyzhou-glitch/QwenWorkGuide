import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  validateCaseSourceMap,
  validateEvidenceLedger,
} from "./content-utils.mjs";

function cell(value) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value).replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
}

function snapshotLocation(path) {
  return path
    ? `[${cell(path)}](${path.replace(/^docs\/public/, "")})`
    : null;
}

export function renderEvidenceLedgerPage(ledger) {
  const published = ledger.claims.filter(
    (claim) => !["pending", "stale"].includes(claim.verification_status),
  );
  const pending = ledger.claims.filter((claim) =>
    ["pending", "stale"].includes(claim.verification_status),
  );
  const renderSections = (claims) =>
    [...claims]
      .sort((a, b) => a.claim_id.localeCompare(b.claim_id))
      .map((claim) => {
        const locationLabel = claim.content_path
          ? `${claim.content_path}#${claim.content_anchor}`
          : "未发布";
        const location = claim.content_path
          ? `[${cell(locationLabel)}](/${claim.content_path
              .replace(/^docs\//, "")
              .replace(/\.md$/, "")}#${claim.content_anchor})`
          : locationLabel;
        const sourceLocation = claim.source.deep_link
          ? `[${claim.source.title}](${claim.source.deep_link})`
          : (snapshotLocation(claim.source.snapshot_path) ??
            [
              claim.source.title,
              claim.source.excerpt,
              claim.source.content_hash,
            ]
              .filter(Boolean)
              .join("；"));
        return `## ${cell(claim.claim_id)}

${cell(claim.claim_text)}

| 字段 | 内容 |
|---|---|
| 主张类型 | ${cell(claim.claim_type)} |
| 来源类型 | ${cell(claim.source.source_type)} |
| 来源定位 | ${cell(sourceLocation)} |
| 核验状态 | ${cell(claim.verification_status)} |
| 正文位置 | ${location} |
| 统计口径 | ${cell(claim.measurement_basis)} |
| 适用范围 | ${cell(claim.applicability)} |
| 局限 | ${cell(claim.limitations.join("；"))} |
| 核验日期 | ${cell(claim.last_verified_at)} |
| 责任角色 | ${cell(claim.reviewer_role)} |`;
      })
      .join("\n\n");
  return `---
title: 主张证据台账
description: V2.0 关键主张的来源、状态与适用边界
status: community-practice
verifiedAt: 2026-08-01
sources: []
---

# 主张证据台账

> 本页由结构化数据自动生成，请修改 \`docs/bluebook/data/evidence-ledger.json\`。本文件及其 JSON 源均为公开内容。

已发布主张：${published.length}；待核验线索：${pending.length}。

## 已发布主张

${renderSections(published)}

## 待核验线索（公开安全）

${renderSections(pending)}
`;
}

export function renderCaseSourceMapPage(caseMap) {
  const published = caseMap.cases.filter(
    (item) => item.included_in_public_count,
  );
  const pending = caseMap.cases.filter(
    (item) => !item.included_in_public_count,
  );
  const renderSections = (items) =>
    items
      .map((item) => {
        const location = item.deep_link
          ? `[${cell(item.deep_link)}](${item.deep_link})`
          : snapshotLocation(item.snapshot_path);
        return `### ${cell(item.case_id)}

| 字段 | 内容 |
|---|---|
| 原始名称 | ${cell(item.original_name)} |
| 原始标签 | ${cell(item.original_tags.join("、"))} |
| 本书分类 | ${cell(item.book_category)} |
| 核验状态 | ${cell(item.verification_status)} |
| 外部记录 ID | ${cell(item.external_record_id)} |
| 原始定位 | ${location ?? "—"} |
| 局限 | ${cell(item.limitations.join("；"))} |`;
      })
      .join("\n\n");
  return `---
title: 案例来源映射
description: V2.0 案例候选的来源定位与公开状态
status: community-practice
verifiedAt: 2026-08-01
sources: []
---

# 案例来源映射

> 本页由结构化数据自动生成，请修改 \`docs/bluebook/data/case-source-map.json\`。

公开案例：${published.length}；待核验线索：${pending.length}。

## 计入公开案例

${renderSections(published)}

## 待核验线索

${renderSections(pending)}
`;
}

async function atomicWrite(path, content) {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.tmp`;
  await writeFile(temporaryPath, content, "utf8");
  await rename(temporaryPath, path);
}

async function readJsonForGeneration(path, failures) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    failures.push(`${path}: ${error.message}`);
    return undefined;
  }
}

export async function generateEvidencePages(options) {
  const failures = [];
  const ledger = await readJsonForGeneration(options.ledgerPath, failures);
  const caseMap = await readJsonForGeneration(options.caseMapPath, failures);
  const today = options.today ?? new Date().toISOString().slice(0, 10);
  if (ledger !== undefined) {
    failures.push(...validateEvidenceLedger(ledger, { today }));
  }
  if (caseMap !== undefined) {
    failures.push(...validateCaseSourceMap(caseMap));
  }
  if (failures.length > 0) return failures;

  const outputs = new Map([
    [options.evidenceOutputPath, renderEvidenceLedgerPage(ledger)],
    [options.caseOutputPath, renderCaseSourceMapPage(caseMap)],
  ]);
  for (const [path, expected] of outputs) {
    if (options.mode === "check") {
      const actual = await readFile(path, "utf8").catch(() => "");
      if (actual !== expected) {
        failures.push(`${path}: 生成页面与 JSON 不一致`);
      }
    } else {
      await atomicWrite(path, expected);
    }
  }
  return failures;
}

async function runCli() {
  const failures = await generateEvidencePages({
    ledgerPath: resolve("docs/bluebook/data/evidence-ledger.json"),
    caseMapPath: resolve("docs/bluebook/data/case-source-map.json"),
    evidenceOutputPath: resolve(
      "docs/bluebook/appendices/evidence-ledger.md",
    ),
    caseOutputPath: resolve("docs/bluebook/appendices/case-source-map.md"),
    mode: process.argv.includes("--check") ? "check" : "write",
  });
  if (failures.length > 0) {
    for (const failure of failures) console.error(failure);
    process.exitCode = 1;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  await runCli();
}
