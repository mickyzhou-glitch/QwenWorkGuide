import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  containsSensitivePattern,
  parseFrontmatter,
  validateCaseBody,
  validatePageMeta,
} from "./content-utils.mjs";

const CASE_DIRECTORY = "docs/cases/submissions";

function displayPath(path) {
  return relative(process.cwd(), path) || path;
}

export async function validateCaseDirectory(directory) {
  const failures = [];
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    failures.push(`${displayPath(directory)}: ${error.message}`);
    return failures;
  }

  const files = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        entry.name !== "README.md",
    )
    .map((entry) => join(directory, entry.name))
    .sort();

  for (const file of files) {
    let source;
    try {
      source = await readFile(file, "utf8");
    } catch (error) {
      failures.push(`${displayPath(file)}: ${error.message}`);
      continue;
    }
    const path = displayPath(file);

    try {
      const { attributes, body } = parseFrontmatter(source);
      for (const error of [
        ...validatePageMeta(attributes),
        ...validateCaseBody(body),
      ]) {
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

async function runCli() {
  const failures = await validateCaseDirectory(CASE_DIRECTORY);

  if (failures.length > 0) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
    return;
  }

  console.log("案例校验通过");
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  runCli().catch((error) => {
    console.error(`案例校验失败：${error.message}`);
    process.exitCode = 1;
  });
}
