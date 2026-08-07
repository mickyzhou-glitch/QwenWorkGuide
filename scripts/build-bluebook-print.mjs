import { createMarkdownRenderer } from "vitepress";
import { readFile, rename, mkdir, unlink, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, dirname, isAbsolute, join, posix, relative, resolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

import { LEGACY_PAGE_MAP, parseFrontmatter } from "./content-utils.mjs";

const MANIFEST_KINDS = new Set([
  "executive-summary",
  "chapter",
  "conclusion",
  "appendix",
]);

const FORBIDDEN_MANIFEST_PATHS = new Set([
  "docs/bluebook/index.md",
  ...LEGACY_PAGE_MAP.keys(),
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeRepositoryPath(rawPath) {
  return posix.normalize(String(rawPath).replaceAll("\\", "/"));
}

export function validateManifest(manifest, { availablePaths = null, expectedCount = null } = {}) {
  const errors = [];
  if (!isPlainObject(manifest)) return ["manifest 必须为对象"];
  for (const key of ["title", "version", "publishedAt", "siteBaseUrl"]) {
    if (typeof manifest[key] !== "string" || manifest[key].trim() === "") {
      errors.push(`manifest 缺少有效字段：${key}`);
    }
  }
  if (!Array.isArray(manifest.items)) {
    return [...errors, "manifest.items 必须为数组"];
  }
  if (expectedCount !== null && manifest.items.length !== expectedCount) {
    errors.push(`manifest 必须包含 ${expectedCount} 项`);
  }

  const ids = new Set();
  const paths = new Set();
  manifest.items.forEach((item, index) => {
    const prefix = `manifest.items[${index}]`;
    if (!isPlainObject(item)) {
      errors.push(`${prefix} 必须为对象`);
      return;
    }
    for (const key of ["id", "path", "title", "kind"]) {
      if (typeof item[key] !== "string" || item[key].trim() === "") {
        errors.push(`${prefix}.${key} 必须为非空字符串`);
      }
    }
    if (!MANIFEST_KINDS.has(item.kind)) {
      errors.push(`${prefix}.kind 不受支持：${item.kind}`);
    }
    if (typeof item.breakBefore !== "boolean") {
      errors.push(`${prefix}.breakBefore 必须为布尔值`);
    }
    if (typeof item.id === "string") {
      if (ids.has(item.id)) errors.push(`${prefix}.id 重复：${item.id}`);
      ids.add(item.id);
    }
    if (typeof item.path !== "string") return;
    const normalized = normalizeRepositoryPath(item.path);
    if (
      normalized !== item.path ||
      !normalized.startsWith("docs/bluebook/") ||
      normalized.includes("/../") ||
      normalized.endsWith("/")
    ) {
      errors.push(`${prefix}.path 必须位于 docs/bluebook/ 且不可穿越：${item.path}`);
    }
    if (
      normalized.startsWith("docs/bluebook/data/") ||
      normalized.startsWith("docs/bluebook/releases/") ||
      FORBIDDEN_MANIFEST_PATHS.has(normalized)
    ) {
      errors.push(`${prefix}.path 不得进入结构化数据、版本说明、首页或兼容页：${item.path}`);
    }
    if (paths.has(normalized)) errors.push(`${prefix}.path 重复：${item.path}`);
    paths.add(normalized);
    if (availablePaths && !availablePaths.has(item.path)) {
      errors.push(`${prefix}.path 文件不存在：${item.path}`);
    }
  });
  return errors;
}

function documentPath(rawPath, currentPath) {
  if (rawPath.startsWith("/")) {
    const sitePath = decodeURIComponent(rawPath).replace(/^\//, "");
    const path = `docs/${sitePath}`;
    if (path.endsWith("/")) return `${path}index.md`;
    return path.endsWith(".md") ? posix.normalize(path) : posix.normalize(`${path}.md`);
  }
  const path = posix.normalize(posix.join(posix.dirname(currentPath), rawPath));
  return path.endsWith(".md") ? path : `${path}.md`;
}

function publicDocumentUrl(path, anchor, siteBaseUrl) {
  const sitePath = path
    .replace(/^docs\//, "")
    .replace(/index\.md$/, "")
    .replace(/\.md$/, "");
  return new URL(`/${sitePath}${anchor ? `#${anchor}` : ""}`, siteBaseUrl).href;
}

export function resolveDocumentLink(rawHref, context) {
  if (/^(?:https?:|mailto:|tel:)/i.test(rawHref)) return rawHref;
  if (rawHref.startsWith("#")) {
    const anchor = decodeURIComponent(rawHref.slice(1));
    if (context.currentRawAnchors.has(anchor)) return `#${anchor}`;
    if (context.currentHeadingAnchors.has(anchor)) return `#${context.currentId}--${anchor}`;
    throw new Error(`同章锚点不存在：${rawHref}`);
  }
  const [rawPath, rawAnchor = ""] = rawHref.split("#", 2);
  const anchor = decodeURIComponent(rawAnchor);
  const targetPath = documentPath(rawPath, context.currentPath);
  const target = context.documentsByPath.get(targetPath);
  if (!target) return publicDocumentUrl(targetPath, anchor, context.siteBaseUrl);
  if (!anchor) return `#${target.id}`;
  const rawAnchors = target.rawAnchors ?? target.structure?.rawAnchors;
  const headingAnchors = target.headingAnchors ?? target.structure?.headingAnchors;
  if (rawAnchors?.has(anchor)) return `#${anchor}`;
  if (headingAnchors?.has(anchor)) return `#${target.id}--${anchor}`;
  throw new Error(`跨章锚点不存在：${rawHref}`);
}

function walkTokens(tokens, visit) {
  for (const token of tokens) {
    visit(token);
    if (Array.isArray(token.children)) walkTokens(token.children, visit);
  }
}

function walkTokenEntries(tokens, visit) {
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    visit(token, tokens, index);
    if (Array.isArray(token.children)) walkTokenEntries(token.children, visit);
  }
}

function stripMarkup(text) {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyHeading(text) {
  const slug = stripMarkup(text)
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\u4e00-\u9fff\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  if (!slug) return "heading";
  return /^\d/u.test(slug) ? `_${slug}` : slug;
}

function tokenHeadingText(tokens, index) {
  const inline = tokens[index + 1];
  if (!inline || inline.type !== "inline") return "heading";
  return inline.content;
}

function collectDocumentStructure(tokens) {
  const headingAnchors = new Set();
  const headingIds = new Map();
  const rawAnchors = new Set();
  const duplicateCounts = new Map();
  walkTokenEntries(tokens, (token, siblings, index) => {
    if (token.type === "heading_open") {
      let anchor = token.attrGet("id") || slugifyHeading(tokenHeadingText(siblings, index));
      const count = duplicateCounts.get(anchor) ?? 0;
      duplicateCounts.set(anchor, count + 1);
      if (count > 0) anchor = `${anchor}-${count}`;
      headingAnchors.add(anchor);
      headingIds.set(token, anchor);
    }
    if (token.type === "html_inline" || token.type === "html_block") {
      for (const match of token.content.matchAll(/\bid=["']([^"']+)["']/g)) {
        rawAnchors.add(match[1]);
      }
    }
  });
  return { headingAnchors, headingIds, rawAnchors };
}

function fileUrlForImage(rawSrc, currentPath, repoRoot) {
  if (/^(?:https?:|data:|mailto:)/i.test(rawSrc)) return rawSrc;
  const imagePath = rawSrc.startsWith("/")
    ? resolve(repoRoot, "docs", rawSrc.replace(/^\//, ""))
    : resolve(repoRoot, dirname(currentPath), rawSrc);
  const relativePath = relative(repoRoot, imagePath);
  if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
    throw new Error(`图片路径越界：${rawSrc}`);
  }
  if (!existsSync(imagePath)) throw new Error(`图片文件不存在：${rawSrc}`);
  return pathToFileURL(imagePath).href;
}

function transformTokens(tokens, context, structure, repoRoot) {
  walkTokens(tokens, (token) => {
    if (token.type === "heading_open") {
      const originalId = structure.headingIds.get(token);
      token.attrSet("id", `${context.currentId}--${originalId}`);
    }
    if (token.type === "link_open") {
      const href = token.attrGet("href");
      if (href) token.attrSet("href", resolveDocumentLink(href, context));
    }
    if (token.type === "image") {
      const src = token.attrGet("src");
      if (src) token.attrSet("src", fileUrlForImage(src, context.currentPath, repoRoot));
    }
  });
}

function assertGlobalAnchors(documents) {
  const seen = new Map();
  for (const document of documents) {
    const anchors = [
      ...document.structure.rawAnchors,
      ...[...document.structure.headingAnchors].map((id) => `${document.id}--${id}`),
      document.id,
    ];
    for (const anchor of anchors) {
      if (seen.has(anchor)) {
        throw new Error(`打印文档锚点重复：${anchor}（${seen.get(anchor)} 与 ${document.path}）`);
      }
      seen.set(anchor, document.path);
    }
  }
}

export async function buildPrintDocument({
  repoRoot = process.cwd(),
  manifest,
  css = "",
} = {}) {
  const root = resolve(repoRoot);
  const manifestErrors = validateManifest(manifest, {
    availablePaths: null,
    expectedCount: manifest?.items?.length ?? null,
  });
  if (manifestErrors.length > 0) throw new Error(manifestErrors.join("\n"));

  const documentsByPath = new Map();
  const renderer = await createMarkdownRenderer(join(root, "docs"));
  const documents = [];
  for (const item of manifest.items) {
    const absolutePath = join(root, item.path);
    if (!existsSync(absolutePath)) throw new Error(`manifest 文件不存在：${item.path}`);
    const source = await readFile(absolutePath, "utf8");
    const { body } = parseFrontmatter(source);
    const tokens = renderer.parse(body, { path: item.path });
    const structure = collectDocumentStructure(tokens);
    const document = { ...item, absolutePath, tokens, structure };
    documents.push(document);
    documentsByPath.set(item.path, document);
  }
  assertGlobalAnchors(documents);

  const sections = [];
  for (const document of documents) {
    const context = {
      currentPath: document.path,
      currentId: document.id,
      documentsByPath,
      currentHeadingAnchors: document.structure.headingAnchors,
      currentRawAnchors: document.structure.rawAnchors,
      siteBaseUrl: manifest.siteBaseUrl,
    };
    transformTokens(document.tokens, context, document.structure, root);
    const rendered = renderer.renderer.render(document.tokens, renderer.options, {
      path: document.path,
    });
    const sectionClass = ["print-section", `kind-${document.kind}`];
    if (document.breakBefore) sectionClass.push("break-before");
    sections.push(
      `<section id="${document.id}" class="${sectionClass.join(" ")}"><div class="section-content">${rendered}</div></section>`,
    );
  }

  const toc = manifest.items
    .map((item) => `<li><a href="#${item.id}">${item.title}</a></li>`)
    .join("\n");
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="QwenWorkGuide V2.0 print builder">
<title>${manifest.title}</title>
<style>${css}</style>
</head>
<body>
<header class="cover"><p>QwenWorkGuide</p><h1>${manifest.title}</h1><p>本地发布候选 · ${manifest.publishedAt}</p></header>
<nav class="toc" aria-label="目录"><h1>目录</h1><ol>${toc}</ol></nav>
${sections.join("\n")}
</body>
</html>
`;
}

function parseCliArguments(argv) {
  const values = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--manifest" || argument === "--output" || argument === "--css") {
      const value = argv[index + 1];
      if (!value) throw new Error(`${argument} 缺少参数`);
      values.set(argument.slice(2), value);
      index += 1;
    }
  }
  if (!values.has("manifest") || !values.has("output")) {
    throw new Error("用法：node scripts/build-bluebook-print.mjs --manifest <path> --output <path>");
  }
  return values;
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseCliArguments(argv);
  const root = process.cwd();
  const manifestPath = resolve(root, args.get("manifest"));
  const outputPath = resolve(root, args.get("output"));
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const cssPath = resolve(root, args.get("css") ?? "docs/.vitepress/theme/print.css");
  const css = await readFile(cssPath, "utf8");
  const html = await buildPrintDocument({ repoRoot: root, manifest, css });
  await mkdir(dirname(outputPath), { recursive: true });
  const temporaryPath = join(dirname(outputPath), `.${basename(outputPath)}.${process.pid}.tmp`);
  try {
    await writeFile(temporaryPath, html, "utf8");
    await rename(temporaryPath, outputPath);
  } catch (error) {
    await unlink(temporaryPath).catch(() => {});
    throw error;
  }
  return outputPath;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
