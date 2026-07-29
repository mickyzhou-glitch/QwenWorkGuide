import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

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

async function findMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findMarkdownFiles(path)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(path);
    }
  }

  return files;
}

async function main() {
  const files = (
    await Promise.all(CONTENT_DIRECTORIES.map(findMarkdownFiles))
  )
    .flat()
    .sort();
  const failures = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const displayPath = relative(process.cwd(), file);

    try {
      const { attributes } = parseFrontmatter(source);
      for (const error of validatePageMeta(attributes)) {
        failures.push(`${displayPath}: ${error}`);
      }
    } catch (error) {
      failures.push(`${displayPath}: ${error.message}`);
    }

    if (containsSensitivePattern(source)) {
      failures.push(`${displayPath}: 检测到疑似密钥或敏感凭证`);
    }
  }

  if (failures.length > 0) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
    return;
  }

  console.log("正式内容校验通过");
}

main().catch((error) => {
  console.error(`正式内容校验失败：${error.message}`);
  process.exitCode = 1;
});
