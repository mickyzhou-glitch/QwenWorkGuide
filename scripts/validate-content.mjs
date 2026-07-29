import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  containsSensitivePattern,
  parseFrontmatter,
  validatePageMeta,
} from "./content-utils.mjs";

const CONTENT_DIRECTORIES = [
  "docs/bluebook",
  "docs/guides",
  "docs/community",
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

async function runCli() {
  const failures = await validateContentRoots(CONTENT_DIRECTORIES);

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
