# QwenWorkGuide 开源站点实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将现有千问办公蓝皮书转化为可公开阅读、可通过 Issue/PR 共创、自动发布到 GitHub Pages 的 `QwenWorkGuide` 开源项目。

**架构：** 使用 VitePress 构建静态文档站，Markdown 内容、社区模板与站点配置同仓维护。Pull Request 运行内容校验和构建检查，`main` 分支通过 GitHub Actions 发布到项目级 GitHub Pages。

**技术栈：** Node.js 22、npm、VitePress、Markdown、Node.js 原生测试、GitHub Actions、GitHub Pages

---

## 文件结构与职责

### 项目与构建

- `package.json`：依赖、构建、测试和内容检查命令。
- `package-lock.json`：锁定依赖版本。
- `.gitignore`：忽略依赖、构建产物、缓存和本地环境文件。
- `docs/.vitepress/config.mts`：站点标题、基础路径、导航、侧边栏、搜索与社交链接。
- `docs/.vitepress/theme/index.ts`：加载默认主题和项目样式。
- `docs/.vitepress/theme/custom.css`：QwenWorkGuide 视觉变量、首页、提示块与移动端样式。

### 内容

- `docs/index.md`：阅读优先首页。
- `docs/reading-guide.md`：新手、任务型读者和团队落地三条阅读路径。
- `docs/bluebook/index.md`：蓝皮书总目录。
- `docs/bluebook/part-1/*.md`：产品认知三章。
- `docs/bluebook/part-2/*.md`：上手方法三章。
- `docs/bluebook/part-3/*.md`：案例与岗位两章。
- `docs/bluebook/part-4/*.md`：企业落地四章。
- `docs/bluebook/appendices/*.md`：指令模板、场景速查、验收清单和来源。
- `docs/cases/index.md`：社区案例库说明。
- `docs/cases/submissions/README.md`：投稿目录规则。
- `docs/guides/quick-start.md`：第一个可验收任务。
- `docs/community/contributing.md`：站点版共创指南。
- `docs/community/content-policy.md`：来源、隐私、时效与 AI 辅助内容规则。

### 下载与公开资源

- `docs/public/downloads/qwenwork-bluebook-v1.docx`：可编辑 Word 版。
- `docs/public/downloads/qwenwork-bluebook-v1.pdf`：PDF 阅读版。
- `docs/public/favicon.svg`：站点图标。

### 社区治理

- `README.md`：项目定位、在线阅读、内容结构、贡献入口和许可证。
- `CONTRIBUTING.md`：本地预览、内容贡献、案例投稿和 PR 流程。
- `CODE_OF_CONDUCT.md`：Contributor Covenant 社区规范。
- `LICENSE-CODE`：MIT License。
- `LICENSE-CONTENT`：CC BY 4.0 许可说明。
- `.github/CASE_TEMPLATE.md`：案例正文模板。
- `.github/PULL_REQUEST_TEMPLATE.md`：PR 自检清单。
- `.github/ISSUE_TEMPLATE/content-correction.yml`：内容勘误。
- `.github/ISSUE_TEMPLATE/case-proposal.yml`：案例提案。
- `.github/ISSUE_TEMPLATE/config.yml`：Issue 模板入口配置。

### 校验与测试

- `scripts/content-utils.mjs`：Frontmatter 解析、Markdown 文件发现与敏感模式定义。
- `scripts/validate-content.mjs`：正式章节字段、来源与核验日期检查。
- `scripts/validate-cases.mjs`：案例必填章节检查。
- `tests/content-utils.test.mjs`：工具函数单元测试。
- `tests/fixtures/*`：合法和非法内容样本。
- `.github/workflows/checks.yml`：PR 构建、测试和内容检查。
- `.github/workflows/deploy-pages.yml`：`main` 分支 GitHub Pages 部署。

## 任务 1：建立最小 VitePress 项目

**文件：**

- 创建：`package.json`
- 创建：`.gitignore`
- 创建：`docs/.vitepress/config.mts`
- 创建：`docs/index.md`
- 生成：`package-lock.json`

- [ ] **步骤 1：编写最小首页作为构建验收夹具**

创建 `docs/index.md`：

```markdown
---
layout: home
title: QwenWorkGuide
description: 非官方、开源、社区共创的千问办公实践指南
---

# QwenWorkGuide

站点初始化中。
```

- [ ] **步骤 2：创建构建配置**

创建 `package.json`：

```json
{
  "name": "qwenworkguide",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs",
    "test": "node --test",
    "check:content": "node scripts/validate-content.mjs && node scripts/validate-cases.mjs",
    "check": "npm run test && npm run check:content && npm run build"
  },
  "devDependencies": {
    "vitepress": "1.6.4"
  },
  "engines": {
    "node": ">=20 <25"
  }
}
```

创建 `.gitignore`：

```gitignore
node_modules/
docs/.vitepress/cache/
docs/.vitepress/dist/
.DS_Store
.env
.env.*
!.env.example
```

创建 `docs/.vitepress/config.mts`：

```ts
import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "zh-CN",
  title: "QwenWorkGuide",
  description: "非官方、开源、社区共创的千问办公实践指南",
  base: "/QwenWorkGuide/",
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    search: { provider: "local" },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/mickyzhou-glitch/QwenWorkGuide"
      }
    ]
  }
});
```

- [ ] **步骤 3：安装依赖并生成锁文件**

运行：

```bash
npm install
```

预期：

- 生成 `package-lock.json`；
- 退出码为 0；
- 无 `npm ERR!`。

- [ ] **步骤 4：运行首次构建**

运行：

```bash
npm run build
```

预期：

```text
build complete
```

并生成 `docs/.vitepress/dist/index.html`。

- [ ] **步骤 5：提交最小站点**

```bash
git add package.json package-lock.json .gitignore docs/index.md docs/.vitepress/config.mts
git commit -m "feat(站点): 初始化 VitePress 文档项目"
```

## 任务 2：先测试内容校验工具

**文件：**

- 创建：`tests/content-utils.test.mjs`
- 创建：`tests/fixtures/valid-page.md`
- 创建：`tests/fixtures/missing-source.md`
- 创建：`scripts/content-utils.mjs`

- [ ] **步骤 1：创建测试夹具**

创建 `tests/fixtures/valid-page.md`：

```markdown
---
title: 测试章节
description: 用于验证内容工具
status: verified
verifiedAt: 2026-07-29
sources:
  - https://qwenwork.cn/docs/product-introduction
---

# 测试章节
```

创建 `tests/fixtures/missing-source.md`：

```markdown
---
title: 缺少来源
description: 这个页面没有来源
status: verified
verifiedAt: 2026-07-29
sources: []
---

# 缺少来源
```

- [ ] **步骤 2：编写失败的单元测试**

创建 `tests/content-utils.test.mjs`：

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  parseFrontmatter,
  validatePageMeta,
  containsSensitivePattern
} from "../scripts/content-utils.mjs";

test("parseFrontmatter parses scalar and list values", async () => {
  const source = await readFile(
    new URL("./fixtures/valid-page.md", import.meta.url),
    "utf8"
  );
  const { attributes } = parseFrontmatter(source);
  assert.equal(attributes.title, "测试章节");
  assert.deepEqual(attributes.sources, [
    "https://qwenwork.cn/docs/product-introduction"
  ]);
});

test("validatePageMeta rejects verified pages without sources", async () => {
  const source = await readFile(
    new URL("./fixtures/missing-source.md", import.meta.url),
    "utf8"
  );
  const { attributes } = parseFrontmatter(source);
  assert.deepEqual(validatePageMeta(attributes), [
    "verified 页面必须至少包含一个来源"
  ]);
});

test("containsSensitivePattern detects common secret formats", () => {
  assert.equal(containsSensitivePattern("token=ghp_1234567890abcdef"), true);
  assert.equal(containsSensitivePattern("这是普通内容"), false);
});
```

- [ ] **步骤 3：运行测试确认失败**

运行：

```bash
npm test
```

预期：FAIL，错误包含：

```text
Cannot find module '../scripts/content-utils.mjs'
```

- [ ] **步骤 4：实现最小内容工具**

创建 `scripts/content-utils.mjs`：

```js
const SECRET_PATTERNS = [
  /gh[pousr]_[A-Za-z0-9]{16,}/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:api[_-]?key|token|secret|password)\s*[:=]\s*["']?[^\s"']{12,}/i
];

function parseValue(raw) {
  const value = raw.trim();
  if (value === "[]") return [];
  if (value === "true") return true;
  if (value === "false") return false;
  return value.replace(/^["']|["']$/g, "");
}

export function parseFrontmatter(source) {
  if (!source.startsWith("---\n")) {
    return { attributes: {}, body: source };
  }

  const end = source.indexOf("\n---\n", 4);
  if (end === -1) {
    throw new Error("Frontmatter 未闭合");
  }

  const block = source.slice(4, end).split("\n");
  const attributes = {};
  let activeList = null;

  for (const line of block) {
    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && activeList) {
      attributes[activeList].push(parseValue(listItem[1]));
      continue;
    }

    const pair = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!pair) continue;
    const [, key, raw] = pair;
    if (raw === "") {
      attributes[key] = [];
      activeList = key;
    } else {
      attributes[key] = parseValue(raw);
      activeList = null;
    }
  }

  return {
    attributes,
    body: source.slice(end + 5)
  };
}

export function validatePageMeta(meta) {
  const errors = [];
  for (const key of ["title", "description", "status", "verifiedAt"]) {
    if (!meta[key]) errors.push(`缺少 Frontmatter 字段：${key}`);
  }

  if (
    meta.status === "verified" &&
    (!Array.isArray(meta.sources) || meta.sources.length === 0)
  ) {
    errors.push("verified 页面必须至少包含一个来源");
  }

  if (
    meta.status &&
    !["verified", "review-needed", "community-practice"].includes(meta.status)
  ) {
    errors.push(`未知 status：${meta.status}`);
  }

  return errors;
}

export function containsSensitivePattern(source) {
  return SECRET_PATTERNS.some((pattern) => pattern.test(source));
}
```

- [ ] **步骤 5：运行测试验证通过**

运行：

```bash
npm test
```

预期：

```text
tests 3
pass 3
fail 0
```

- [ ] **步骤 6：提交内容工具**

```bash
git add scripts/content-utils.mjs tests
git commit -m "test(内容): 添加 Frontmatter 与敏感信息校验"
```

## 任务 3：实现正式章节与案例校验

**文件：**

- 创建：`scripts/validate-content.mjs`
- 创建：`scripts/validate-cases.mjs`
- 创建：`tests/fixtures/valid-case.md`
- 修改：`tests/content-utils.test.mjs`

- [ ] **步骤 1：添加案例夹具和失败测试**

创建 `tests/fixtures/valid-case.md`：

```markdown
---
title: 会议纪要闭环
description: 从会议转写生成纪要和待办草稿
status: community-practice
verifiedAt: 2026-07-29
sources:
  - https://qwenwork.cn/docs/desktop/im-channels
---

# 会议纪要闭环

## 场景与问题
## 适用角色
## 输入资料
## 使用能力
## 任务描述
## 执行步骤
## 最终产物
## 验收标准
## 权限与安全边界
## 可复现证据
## 贡献者与核验日期
```

在 `tests/content-utils.test.mjs` 中增加：

```js
import { validateCaseBody } from "../scripts/content-utils.mjs";

test("validateCaseBody accepts a complete case", async () => {
  const source = await readFile(
    new URL("./fixtures/valid-case.md", import.meta.url),
    "utf8"
  );
  const { body } = parseFrontmatter(source);
  assert.deepEqual(validateCaseBody(body), []);
});

test("validateCaseBody reports every missing section", () => {
  const errors = validateCaseBody("# 不完整案例\n\n## 场景与问题");
  assert.ok(errors.includes("案例缺少章节：验收标准"));
  assert.ok(errors.includes("案例缺少章节：权限与安全边界"));
});
```

- [ ] **步骤 2：运行测试确认失败**

运行：

```bash
npm test
```

预期：FAIL，错误包含：

```text
does not provide an export named 'validateCaseBody'
```

- [ ] **步骤 3：实现案例正文校验**

在 `scripts/content-utils.mjs` 末尾增加：

```js
const REQUIRED_CASE_SECTIONS = [
  "场景与问题",
  "适用角色",
  "输入资料",
  "使用能力",
  "任务描述",
  "执行步骤",
  "最终产物",
  "验收标准",
  "权限与安全边界",
  "可复现证据",
  "贡献者与核验日期"
];

export function validateCaseBody(body) {
  return REQUIRED_CASE_SECTIONS
    .filter((heading) => !body.includes(`## ${heading}`))
    .map((heading) => `案例缺少章节：${heading}`);
}
```

- [ ] **步骤 4：实现正式内容扫描**

创建 `scripts/validate-content.mjs`：

```js
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import {
  containsSensitivePattern,
  parseFrontmatter,
  validatePageMeta
} from "./content-utils.mjs";

async function markdownFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(root, entry.name);
      if (entry.isDirectory()) return markdownFiles(path);
      return entry.isFile() && path.endsWith(".md") ? [path] : [];
    })
  );
  return nested.flat();
}

const roots = [
  "docs/bluebook",
  "docs/guides",
  "docs/community"
];
const failures = [];

for (const root of roots) {
  for (const file of await markdownFiles(root)) {
    const source = await readFile(file, "utf8");
    const { attributes } = parseFrontmatter(source);
    for (const error of validatePageMeta(attributes)) {
      failures.push(`${file}: ${error}`);
    }
    if (containsSensitivePattern(source)) {
      failures.push(`${file}: 检测到疑似密钥或敏感凭证`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("正式内容校验通过");
```

- [ ] **步骤 5：实现案例扫描**

创建 `scripts/validate-cases.mjs`：

```js
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import {
  containsSensitivePattern,
  parseFrontmatter,
  validateCaseBody,
  validatePageMeta
} from "./content-utils.mjs";

const root = "docs/cases/submissions";
const failures = [];

for (const entry of await readdir(root, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".md") || entry.name === "README.md") {
    continue;
  }
  const file = join(root, entry.name);
  const source = await readFile(file, "utf8");
  const { attributes, body } = parseFrontmatter(source);
  for (const error of [...validatePageMeta(attributes), ...validateCaseBody(body)]) {
    failures.push(`${file}: ${error}`);
  }
  if (containsSensitivePattern(source)) {
    failures.push(`${file}: 检测到疑似密钥或敏感凭证`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("案例校验通过");
```

- [ ] **步骤 6：运行测试并提交**

运行：

```bash
npm test
```

预期：

```text
tests 5
pass 5
fail 0
```

提交：

```bash
git add scripts tests
git commit -m "feat(内容): 添加章节与案例自动校验"
```

## 任务 4：迁移蓝皮书内容

**文件：**

- 创建：`docs/bluebook/index.md`
- 创建：`docs/bluebook/part-1/01-from-answer-to-delivery.md`
- 创建：`docs/bluebook/part-1/02-three-surfaces.md`
- 创建：`docs/bluebook/part-1/03-capability-architecture.md`
- 创建：`docs/bluebook/part-2/04-first-task.md`
- 创建：`docs/bluebook/part-2/05-skills-connectors-experts.md`
- 创建：`docs/bluebook/part-2/06-automation.md`
- 创建：`docs/bluebook/part-3/07-office-delivery.md`
- 创建：`docs/bluebook/part-3/08-role-roadmaps.md`
- 创建：`docs/bluebook/part-4/09-organization-rollout.md`
- 创建：`docs/bluebook/part-4/10-security-governance.md`
- 创建：`docs/bluebook/part-4/11-value-measurement.md`
- 创建：`docs/bluebook/part-4/12-product-ecosystem.md`
- 创建：`docs/bluebook/appendices/prompt-templates.md`
- 创建：`docs/bluebook/appendices/scenario-index.md`
- 创建：`docs/bluebook/appendices/launch-checklist.md`
- 创建：`docs/bluebook/appendices/sources.md`
- 创建：`docs/reading-guide.md`
- 创建：`docs/guides/quick-start.md`

- [ ] **步骤 1：为每个页面添加可校验 Frontmatter**

每个正式页面使用以下结构，并替换实际标题、描述和来源：

```yaml
---
title: 从回答问题到交付结果
description: 理解千问办公如何从对话走向可编辑产物与任务闭环
status: verified
verifiedAt: 2026-07-29
sources:
  - https://qwenwork.cn/docs/product-introduction
---
```

- [ ] **步骤 2：按设计规格拆分现有蓝皮书**

来源文件：

```text
../千问办公蓝皮书.md
```

拆分规则：

- 删除 Word 专用的 `\pagebreak`；
- 保留正文、表格、提示词和来源编号；
- 将来源编号链接到 `appendices/sources.md`；
- 不复制编写脚本、内部文件路径或 QA 中间产物；
- 不把封面元数据重复为正文页面；
- 每章只有一个一级标题。

- [ ] **步骤 3：创建蓝皮书目录和阅读指南**

`docs/bluebook/index.md` 必须包含：

- 四篇十二章完整目录；
- 每篇适用读者；
- “第一次使用”“已有具体任务”“准备团队落地”三条入口；
- 内容状态说明；
- Word/PDF 下载入口。

`docs/reading-guide.md` 必须包含：

- 新手顺序阅读路线；
- 按任务查找路线；
- 团队负责人路线；
- 事实、实践和建议三类内容标识。

- [ ] **步骤 4：运行内容检查并修复失败**

运行：

```bash
npm run check:content
```

预期：

```text
正式内容校验通过
案例校验通过
```

- [ ] **步骤 5：构建并检查页面数量**

运行：

```bash
npm run build
find docs/.vitepress/dist/bluebook -name '*.html' | wc -l
```

预期：

- 构建退出码为 0；
- 蓝皮书 HTML 页面不少于 17 个；
- 无未解析路由或资源警告。

- [ ] **步骤 6：提交内容迁移**

```bash
git add docs/bluebook docs/reading-guide.md docs/guides/quick-start.md
git commit -m "docs(蓝皮书): 迁移四篇十二章与附录"
```

## 任务 5：实现阅读优先首页和主题

**文件：**

- 修改：`docs/index.md`
- 创建：`docs/.vitepress/theme/index.ts`
- 创建：`docs/.vitepress/theme/custom.css`
- 修改：`docs/.vitepress/config.mts`
- 创建：`docs/public/favicon.svg`

- [ ] **步骤 1：更新首页内容**

将 `docs/index.md` 替换为：

```markdown
---
layout: home
title: QwenWorkGuide
titleTemplate: false
description: 非官方、开源、社区共创的千问办公实践指南

hero:
  name: QwenWorkGuide
  text: 从一句话，到可交付的工作系统
  tagline: 非官方、开源、社区共创的千问办公实战指南
  actions:
    - theme: brand
      text: 开始阅读
      link: /bluebook/
    - theme: alt
      text: 查找案例
      link: /cases/
    - theme: alt
      text: 参与共创
      link: /community/contributing

features:
  - title: 使用手册
    details: 从第一项可验收任务开始，理解 Web、桌面端与钉钉入口。
    link: /bluebook/part-1/01-from-answer-to-delivery
  - title: 真实案例
    details: Word、Excel、PPT、网页、会议与岗位工作流。
    link: /bluebook/part-3/07-office-delivery
  - title: 进阶方法
    details: Skill、连接器、专家套件、定时任务与自动化治理。
    link: /bluebook/part-2/05-skills-connectors-experts
  - title: 企业落地
    details: 30/60/90 天路线、安全、价值度量与生态建议。
    link: /bluebook/part-4/09-organization-rollout
---

::: warning 非官方项目
本项目由社区独立维护，不代表千问办公或阿里巴巴官方立场。
功能、价格、权益和可用范围请以千问办公官方渠道为准。
:::

## 推荐阅读方式

- 第一次使用：从“使用手册”开始。
- 已有具体任务：进入案例库或场景速查表。
- 准备团队落地：重点阅读企业落地篇与上线验收清单。

## 参与共创

你可以报告内容错误、提交真实案例，或参与章节与专题共建。
所有贡献都需要说明来源、核验日期和安全边界。
```

- [ ] **步骤 2：创建主题入口**

创建 `docs/.vitepress/theme/index.ts`：

```ts
import DefaultTheme from "vitepress/theme";
import "./custom.css";

export default {
  extends: DefaultTheme
};
```

- [ ] **步骤 3：创建项目视觉变量**

创建 `docs/.vitepress/theme/custom.css`：

```css
:root {
  --vp-c-brand-1: #1468a8;
  --vp-c-brand-2: #0f5b94;
  --vp-c-brand-3: #0b4c7d;
  --vp-c-brand-soft: rgba(20, 104, 168, 0.12);
  --qwg-navy: #102a43;
  --qwg-teal: #168f82;
}

.dark {
  --vp-c-brand-1: #58a6d9;
  --vp-c-brand-2: #71b7e0;
  --vp-c-brand-3: #8ac8e7;
  --vp-c-brand-soft: rgba(88, 166, 217, 0.16);
}

.VPHero .name {
  color: var(--qwg-teal);
}

.VPHero .text {
  color: var(--qwg-navy);
  letter-spacing: 0;
}

.dark .VPHero .text {
  color: var(--vp-c-text-1);
}

.VPFeature {
  border-radius: 6px;
}

.vp-doc table {
  display: table;
  width: 100%;
}

@media (max-width: 720px) {
  .vp-doc table {
    display: block;
    overflow-x: auto;
  }
}
```

- [ ] **步骤 4：补全站点导航和侧边栏**

更新 `docs/.vitepress/config.mts`，在 `themeConfig` 中增加：

```ts
nav: [
  { text: "蓝皮书", link: "/bluebook/" },
  { text: "案例库", link: "/cases/" },
  { text: "阅读指南", link: "/reading-guide" },
  { text: "参与共创", link: "/community/contributing" }
],
sidebar: {
  "/bluebook/": [
    {
      text: "第一篇 重新理解 AI 办公",
      collapsed: false,
      items: [
        { text: "从回答问题到交付结果", link: "/bluebook/part-1/01-from-answer-to-delivery" },
        { text: "三端一体", link: "/bluebook/part-1/02-three-surfaces" },
        { text: "六层能力架构", link: "/bluebook/part-1/03-capability-architecture" }
      ]
    },
    {
      text: "第二篇 先把千问办公用起来",
      items: [
        { text: "完成第一项任务", link: "/bluebook/part-2/04-first-task" },
        { text: "Skill、连接器与专家套件", link: "/bluebook/part-2/05-skills-connectors-experts" },
        { text: "自动化", link: "/bluebook/part-2/06-automation" }
      ]
    },
    {
      text: "第三篇 真实工作流案例",
      items: [
        { text: "办公交付", link: "/bluebook/part-3/07-office-delivery" },
        { text: "岗位路线", link: "/bluebook/part-3/08-role-roadmaps" }
      ]
    },
    {
      text: "第四篇 企业落地与商业化",
      items: [
        { text: "组织落地", link: "/bluebook/part-4/09-organization-rollout" },
        { text: "安全与治理", link: "/bluebook/part-4/10-security-governance" },
        { text: "价值度量", link: "/bluebook/part-4/11-value-measurement" },
        { text: "产品与生态建议", link: "/bluebook/part-4/12-product-ecosystem" }
      ]
    },
    {
      text: "附录",
      items: [
        { text: "指令模板", link: "/bluebook/appendices/prompt-templates" },
        { text: "场景速查", link: "/bluebook/appendices/scenario-index" },
        { text: "上线验收", link: "/bluebook/appendices/launch-checklist" },
        { text: "来源", link: "/bluebook/appendices/sources" }
      ]
    }
  ]
},
editLink: {
  pattern: "https://github.com/mickyzhou-glitch/QwenWorkGuide/edit/main/docs/:path",
  text: "在 GitHub 上编辑本页"
},
docFooter: {
  prev: "上一章",
  next: "下一章"
},
lastUpdated: {
  text: "最后更新"
}
```

- [ ] **步骤 5：构建并提交首页**

运行：

```bash
npm run build
```

预期：构建成功，无链接解析错误。

提交：

```bash
git add docs/index.md docs/.vitepress docs/public/favicon.svg
git commit -m "feat(首页): 实现阅读优先的信息架构与主题"
```

## 任务 6：添加社区案例与治理文件

**文件：**

- 创建：`docs/cases/index.md`
- 创建：`docs/cases/submissions/README.md`
- 创建：`docs/community/contributing.md`
- 创建：`docs/community/content-policy.md`
- 创建：`.github/CASE_TEMPLATE.md`
- 创建：`.github/PULL_REQUEST_TEMPLATE.md`
- 创建：`.github/ISSUE_TEMPLATE/content-correction.yml`
- 创建：`.github/ISSUE_TEMPLATE/case-proposal.yml`
- 创建：`.github/ISSUE_TEMPLATE/config.yml`
- 创建：`README.md`
- 创建：`CONTRIBUTING.md`
- 创建：`CODE_OF_CONDUCT.md`
- 创建：`LICENSE-CODE`
- 创建：`LICENSE-CONTENT`

- [ ] **步骤 1：创建案例模板**

`.github/CASE_TEMPLATE.md` 使用：

```markdown
---
title: 案例标题
description: 一句话说明任务与结果
status: community-practice
verifiedAt: YYYY-MM-DD
sources:
  - https://来源地址
---

# 案例标题

## 场景与问题
## 适用角色
## 输入资料
## 使用能力
## 任务描述
## 执行步骤
## 最终产物
## 验收标准
## 权限与安全边界
## 可复现证据
## 贡献者与核验日期
```

- [ ] **步骤 2：创建 PR 自检**

`.github/PULL_REQUEST_TEMPLATE.md` 使用：

```markdown
## 变更说明

<!-- 说明修改了什么，以及为什么修改。 -->

## 变更类型

- [ ] 内容勘误
- [ ] 产品信息更新
- [ ] 新案例
- [ ] 新章节或专题
- [ ] 站点与工具

## 自检

- [ ] 已删除客户隐私、企业内部资料和密钥
- [ ] 产品信息标注了来源和核验日期
- [ ] 案例包含验收标准与安全边界
- [ ] 已运行 `npm run check`
- [ ] 同意内容按 CC BY 4.0、代码按 MIT 发布
```

- [ ] **步骤 3：创建 Issue 表单**

`content-correction.yml` 必填：

- 页面链接；
- 当前内容；
- 建议修正；
- 证据来源；
- 核验日期。

`case-proposal.yml` 必填：

- 使用角色；
- 真实任务；
- 输入资料；
- 期望交付；
- 可公开证据；
- 敏感信息处理方式。

- [ ] **步骤 4：创建双许可证**

`LICENSE-CODE` 使用 SPDX 标准 MIT License 全文，版权行为：

```text
Copyright (c) 2026 QwenWorkGuide contributors
```

`LICENSE-CONTENT` 明确：

```text
Unless otherwise noted, written content in docs/ is licensed under
Creative Commons Attribution 4.0 International (CC BY 4.0).

License text:
https://creativecommons.org/licenses/by/4.0/legalcode
```

并说明第三方图片、商标和引用材料不因该许可自动重新授权。

- [ ] **步骤 5：创建 README 和贡献指南**

README 必须包含：

- 非官方项目声明；
- 在线阅读地址；
- 项目内容；
- 推荐阅读方式；
- 本地运行；
- 三条贡献路径；
- 双许可证；
- 千问办公商标归其权利人所有。

CONTRIBUTING 必须包含：

```bash
npm install
npm run dev
npm run check
```

并说明分支、Commit、PR、自检和案例投稿目录。

- [ ] **步骤 6：校验并提交社区文件**

运行：

```bash
npm run check
```

预期：测试、内容检查和构建全部通过。

提交：

```bash
git add .github README.md CONTRIBUTING.md CODE_OF_CONDUCT.md LICENSE-CODE LICENSE-CONTENT docs/cases docs/community
git commit -m "docs(社区): 添加案例投稿与开源治理体系"
```

## 任务 7：添加 Word/PDF 下载

**文件：**

- 创建：`docs/public/downloads/qwenwork-bluebook-v1.docx`
- 创建：`docs/public/downloads/qwenwork-bluebook-v1.pdf`
- 修改：`docs/bluebook/index.md`
- 修改：`README.md`

- [ ] **步骤 1：复制已验证的蓝皮书产物**

源文件：

```text
../千问办公（Qwen Work）蓝皮书_V1.0.docx
../千问办公（Qwen Work）蓝皮书_V1.0.pdf
```

目标：

```text
docs/public/downloads/qwenwork-bluebook-v1.docx
docs/public/downloads/qwenwork-bluebook-v1.pdf
```

- [ ] **步骤 2：核对文件类型和大小**

运行：

```bash
file docs/public/downloads/qwenwork-bluebook-v1.docx
file docs/public/downloads/qwenwork-bluebook-v1.pdf
test -s docs/public/downloads/qwenwork-bluebook-v1.docx
test -s docs/public/downloads/qwenwork-bluebook-v1.pdf
```

预期：

- DOCX 被识别为 Microsoft Word 2007+；
- PDF 被识别为 PDF document；
- 四条命令退出码均为 0。

- [ ] **步骤 3：添加下载链接**

在 `docs/bluebook/index.md` 和 `README.md` 中使用：

```markdown
- [下载 Word 可编辑版](/QwenWorkGuide/downloads/qwenwork-bluebook-v1.docx)
- [下载 PDF 阅读版](/QwenWorkGuide/downloads/qwenwork-bluebook-v1.pdf)
```

- [ ] **步骤 4：构建并验证下载产物**

运行：

```bash
npm run build
test -s docs/.vitepress/dist/downloads/qwenwork-bluebook-v1.docx
test -s docs/.vitepress/dist/downloads/qwenwork-bluebook-v1.pdf
```

预期：全部通过。

- [ ] **步骤 5：提交下载产物**

```bash
git add docs/public/downloads docs/bluebook/index.md README.md
git commit -m "docs(下载): 提供蓝皮书 Word 与 PDF 版本"
```

## 任务 8：配置持续集成与 GitHub Pages

**文件：**

- 创建：`.github/workflows/checks.yml`
- 创建：`.github/workflows/deploy-pages.yml`

- [ ] **步骤 1：创建 PR 检查工作流**

创建 `.github/workflows/checks.yml`：

```yaml
name: Checks

on:
  pull_request:
  push:
    branches:
      - main

permissions:
  contents: read

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run check
```

- [ ] **步骤 2：创建 Pages 工作流**

创建 `.github/workflows/deploy-pages.yml`：

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run check
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **步骤 3：本地验证 YAML 中的关键字段**

运行：

```bash
rg -n "pages: write|id-token: write|upload-pages-artifact|deploy-pages" .github/workflows
```

预期：四个关键配置均有匹配结果。

- [ ] **步骤 4：运行完整检查并提交**

运行：

```bash
npm run check
```

预期：全部通过。

提交：

```bash
git add .github/workflows
git commit -m "ci(发布): 配置检查与 GitHub Pages 自动部署"
```

## 任务 9：最终验证与公开发布

**文件：**

- 检查：整个仓库
- 修改：仅限验证发现的问题

- [ ] **步骤 1：检查公开仓库内容边界**

运行：

```bash
git status --short
git ls-files
```

预期：

- 工作树干净；
- 不包含父目录中的 Excel、客户图片、DOCX 构建脚本或 `.superpowers/` 原型；
- 下载目录只包含公开 Word/PDF。

- [ ] **步骤 2：运行最终验证**

运行：

```bash
npm ci
npm run check
```

预期：

- 单元测试全部通过；
- 正式内容和案例检查通过；
- VitePress 构建成功。

- [ ] **步骤 3：创建公开 GitHub 仓库**

运行：

```bash
gh repo create mickyzhou-glitch/QwenWorkGuide \
  --public \
  --description "非官方、开源、社区共创的千问办公实践指南" \
  --source . \
  --remote origin
```

预期：

- 创建 `https://github.com/mickyzhou-glitch/QwenWorkGuide`；
- 本地新增 `origin`；
- 仓库可公开访问。

- [ ] **步骤 4：推送 main 分支**

运行：

```bash
git push -u origin main
```

预期：

- 推送成功；
- GitHub Actions 自动开始运行。

- [ ] **步骤 5：启用 GitHub Pages Actions 构建源**

运行：

```bash
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  /repos/mickyzhou-glitch/QwenWorkGuide/pages \
  -f build_type=workflow
```

如果响应为“Pages site already exists”，改为：

```bash
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  /repos/mickyzhou-glitch/QwenWorkGuide/pages \
  -f build_type=workflow
```

预期：Pages 使用 GitHub Actions 作为构建源。

- [ ] **步骤 6：等待工作流完成**

运行：

```bash
gh run list --limit 10
gh run watch --exit-status
```

预期：

- `Checks` 成功；
- `Deploy GitHub Pages` 成功。

- [ ] **步骤 7：验证线上站点**

运行：

```bash
curl -I https://mickyzhou-glitch.github.io/QwenWorkGuide/
curl -I https://mickyzhou-glitch.github.io/QwenWorkGuide/bluebook/
curl -I https://mickyzhou-glitch.github.io/QwenWorkGuide/downloads/qwenwork-bluebook-v1.pdf
```

预期：三个地址最终均返回 HTTP 200。

- [ ] **步骤 8：创建首个发布标签**

运行：

```bash
git tag -a v0.1.0 -m "QwenWorkGuide 首次公开发布"
git push origin v0.1.0
```

预期：远端存在 `v0.1.0` 标签。

- [ ] **步骤 9：记录发布结果**

在最终交付中提供：

- GitHub 仓库地址；
- GitHub Pages 地址；
- Word/PDF 下载入口；
- 首版内容与共创方式；
- 自动化检查状态；
- 后续维护建议。

