# 面向普通办公用户的 V2 阅读体验实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将 QwenWorkGuide V2 的阅读顺序改为“基本介绍 → 案例与场景 → 方法与操作 → 阶段、治理、权限与深入资料”，让普通办公用户先理解价值和具体任务，再进入技术与组织方法。

**架构：** 保留现有 Markdown/VitePress、证据台账、旧 URL 和 PDF 构建链。通过重写首页和章节首屏、恢复案例叙事、调整 V2 导航/manifest 顺序，把技术内容从入口层下沉到深入阅读层；不删除治理规则，不把客户陈述升级为已核验事实。

**技术栈：** Markdown、VitePress 1.6.4、Node.js `node:test`、`scripts/content-utils.mjs`、确定性 Chrome PDF 构建脚本。

---

## 文件清单与职责

### 创建

- `docs/superpowers/specs/2026-08-07-reader-first-content-design.md`：已确认的阅读体验设计规格。
- `docs/superpowers/plans/2026-08-07-reader-first-content-plan.md`：本实现计划。

### 修改：入口与案例

- `docs/index.md`：普通用户首页、任务入口卡和第一阅读路径。
- `docs/bluebook/index.md`：蓝皮书首页、章节分组和阅读路径。
- `docs/bluebook/executive-summary.md`：基本介绍和价值判断，保留现有 claim 锚点。
- `docs/cases/index.md`：案例库首页、案例状态说明和按任务进入的链接。
- `docs/cases/submissions/pisen-competitive-research-product-materials.md`：品胜案例的故事、产物和复用步骤。
- `docs/cases/submissions/youkela-product-rd-payroll.md`：优克拉案例的故事、产物和复用步骤。
- `docs/cases/submissions/qwenwork-public-case-atlas.md`：32 个公开场景图谱和复用入口。
- `docs/bluebook/part-3/09-public-case-atlas.md`：案例章节的可阅读入口、证据边界和核验说明。

### 修改：导航与 PDF 顺序

- `scripts/bluebook-v2-manifest.json`：将 PDF 顺序改为序章、案例、方法、专业任务、治理、结语、附录。
- `scripts/content-utils.mjs`：更新 `BLUEBOOK_V2_PATHS`、`BLUEBOOK_V2_NEXT_CHAIN` 和 sidebar 分组。
- `docs/bluebook/part-1/01-delivery-standard.md`：更新下一章链接和普通用户首屏。
- `docs/bluebook/part-1/02-task-delivery-protocol.md`：更新下一章链接和普通用户首屏。
- `docs/bluebook/part-2/03-work-environment-architecture.md`：更新普通语言首屏和案例入口。
- `docs/bluebook/part-2/04-skills-connectors-expert-kits.md`：更新术语解释、首屏和案例入口。
- `docs/bluebook/part-2/05-automation-boundaries.md`：更新普通语言首屏和案例入口。
- `docs/bluebook/part-3/06-office-delivery.md`：更新任务导向首屏和案例入口。
- `docs/bluebook/part-3/07-role-roadmaps.md`：更新岗位任务入口和案例入口。
- `docs/bluebook/part-3/08-research-evidence-chain.md`：更新研究任务首屏和下一章链接。
- `docs/bluebook/part-4/10-pilot-roadmap.md`：把阶段门说明放到团队落地路径，保留完整规则。
- `docs/bluebook/part-4/11-security-governance.md`：先讲普通用户为什么需要安全边界，再展开权限规则。
- `docs/bluebook/part-4/12-workflow-operations.md`：先讲团队如何减少重复劳动，再讲运营指标。
- `docs/bluebook/part-4/13-value-measurement.md`：先讲如何判断有没有帮上忙，再讲度量模型。
- `docs/bluebook/conclusion-product-ecosystem.md`：把状态栏和生态判断放到深入阅读层。

### 修改：测试与验证

- `tests/content-utils.test.mjs`：增加读者入口、案例入口、章节顺序和 next-chain 回归测试。
- `tests/fixtures/pdf/manifest-valid.json`：若 PDF manifest fixture 使用固定顺序，则同步更新为新的 reader-first 顺序。
- `docs/bluebook/releases/v2.0-pdf-qa.md`：记录新的页数、目录/书签检查和逐页 QA 结果。

## 任务 1：建立读者优先的失败测试

**文件：**
- 修改：`tests/content-utils.test.mjs`
- 修改：`scripts/content-utils.mjs`

- [ ] **步骤 1：增加顺序和入口契约测试**

在现有测试文件中加入一个只检查公开入口行为的测试，断言首页和蓝皮书首页含有普通用户任务入口，且 V2 顺序先于方法章节出现案例章节：

```js
test("reader-first navigation starts with introduction and cases", async () => {
  const home = await readFile(join(docsRoot, "index.md"), "utf8");
  const bluebook = await readFile(join(docsRoot, "bluebook/index.md"), "utf8");
  const summary = await readFile(
    join(docsRoot, "bluebook/executive-summary.md"),
    "utf8",
  );

  assert.match(home, /你今天想把哪件办公工作做完/);
  assert.match(home, /写一份汇报|整理一次会议|分析一批数据/);
  assert.match(bluebook, /基本介绍|案例与场景|阶段、治理、权限/);
  assert.match(summary, /普通办公用户|先做完一件事|真实案例/);
  assert.equal(
    BLUEBOOK_V2_PATHS.indexOf("docs/bluebook/part-3/09-public-case-atlas.md") <
      BLUEBOOK_V2_PATHS.indexOf("docs/bluebook/part-1/01-delivery-standard.md"),
    true,
  );
});
```

- [ ] **步骤 2：运行测试确认失败**

运行：`node --test tests/content-utils.test.mjs`

预期：新增测试失败，失败原因是当前首页没有“你今天想把哪件办公工作做完”，且 `BLUEBOOK_V2_PATHS` 中案例章节仍在交付方法章节之后。

- [ ] **步骤 3：Commit 测试基线**

```bash
git add tests/content-utils.test.mjs
git commit -m "test(阅读体验): 添加普通用户入口契约"
```

## 任务 2：重写首页、蓝皮书首页和执行摘要

**文件：**
- 修改：`docs/index.md`
- 修改：`docs/bluebook/index.md`
- 修改：`docs/bluebook/executive-summary.md`
- 测试：`tests/content-utils.test.mjs`

- [ ] **步骤 1：重写首页首屏**

将首页 hero 和 features 改成普通用户任务语言，保留 PDF 下载和非官方提示。首屏核心文案采用：

```md
hero:
  text: 把今天的办公任务做完
  tagline: 从汇报、会议、表格到研究，找到一个可以马上开始的做法
```

任务卡固定为“写汇报、整理会议、分析数据、制作 PPT/物料、查资料、做网页/内容草稿”，每张卡包含场景、产物和阅读链接，不在卡片标题中使用“工作流、证据链、阶段门”等术语。

- [ ] **步骤 2：重写蓝皮书首页入口**

将“从这里开始”改为四条读者路径：

```md
## 你可以从这里开始

- 第一次接触：先看千问办公能帮你做什么。
- 想看别人怎么做：先看品胜、优克拉和 32 个场景案例。
- 手上有具体任务：直接进入对应的交付方法。
- 准备团队使用：最后阅读阶段、治理和权限。
```

- [ ] **步骤 3：重写执行摘要首屏**

保留原有 claim 锚点和证据引用，但把标题和前两屏改成“先把一件办公工作做完”的读者语言。每个技术判断后紧跟一个普通办公例子；将“证据边界、阶段门、治理”移动到摘要后半部分。

- [ ] **步骤 4：运行入口测试确认通过**

运行：`node --test tests/content-utils.test.mjs`

预期：入口文案断言通过；章节顺序断言暂时仍失败，直到任务 3 完成。

- [ ] **步骤 5：Commit 入口内容**

```bash
git add docs/index.md docs/bluebook/index.md docs/bluebook/executive-summary.md
git commit -m "docs(入口): 改为普通用户任务导向"
```

## 任务 3：把案例放到基本介绍之后

**文件：**
- 修改：`docs/cases/index.md`
- 修改：`docs/cases/submissions/pisen-competitive-research-product-materials.md`
- 修改：`docs/cases/submissions/youkela-product-rd-payroll.md`
- 修改：`docs/cases/submissions/qwenwork-public-case-atlas.md`
- 修改：`docs/bluebook/part-3/09-public-case-atlas.md`
- 测试：`tests/content-utils.test.mjs`

- [ ] **步骤 1：统一案例正文模板**

每个案例按以下顺序组织：

```md
## 这件事原来为什么麻烦
## 最后做出了什么
## 可以照着复用的步骤
## 需要人工确认的地方
## 证据和使用边界
```

保留品胜和优克拉原有客户陈述，不改写为独立核验结果；保留 32 个场景的分类、任务描述、输入、产物和验收标准；把“待核验”放在案例读者已经看到场景之后。结构化 case map 的 `included_in_public_count` 不在本任务中修改，仍保持已核验公开案例为 0。

- [ ] **步骤 2：在蓝皮书案例章加入案例卡片**

在第 9 章开头的证据统计之后增加三个可阅读入口：品胜、优克拉、32 个场景图谱，并用一句话说明“可阅读不等于已通过证据发布门”。

- [ ] **步骤 3：运行案例校验**

运行：`npm run check:content`

预期：输出“正式内容校验通过”和“案例校验通过”，证据统计仍显示 0/32。

- [ ] **步骤 4：Commit 案例层**

```bash
git add docs/cases docs/bluebook/part-3/09-public-case-atlas.md
git commit -m "docs(案例): 按普通用户顺序组织案例阅读"
```

## 任务 4：更新网站 sidebar、章节顺序和 PDF manifest

**文件：**
- 修改：`scripts/bluebook-v2-manifest.json`
- 修改：`scripts/content-utils.mjs`
- 修改：`tests/content-utils.test.mjs`
- 修改：`docs/bluebook/index.md`
- 修改：`docs/bluebook/executive-summary.md`
- 修改：`docs/bluebook/part-1/01-delivery-standard.md`
- 修改：`docs/bluebook/part-3/08-research-evidence-chain.md`
- 修改：`docs/bluebook/part-3/09-public-case-atlas.md`

- [ ] **步骤 1：调整 `BLUEBOOK_V2_PATHS` 和 sidebar 分组**

将入口顺序改为：

```text
序章
案例与场景图谱（原第 9 章路径）
完成一次交付（原第 1–2 章）
沉淀一条工作流（原第 3–5 章）
专业办公任务（原第 6–8 章）
团队阶段、治理与价值（原第 10–13 章）
结语
附录
```

保留所有文件路径和旧 URL，只调整显示分组、导航顺序和 manifest title；案例章节显示为“案例与场景图谱”，避免普通读者被“第 9 章”阻挡。

- [ ] **步骤 2：更新 next-chain**

`BLUEBOOK_V2_NEXT_CHAIN` 的前四条必须变成：

```js
[
  ["docs/bluebook/executive-summary.md", "/bluebook/part-3/09-public-case-atlas"],
  ["docs/bluebook/part-3/09-public-case-atlas.md", "/bluebook/part-1/01-delivery-standard"],
  ["docs/bluebook/part-1/01-delivery-standard.md", "/bluebook/part-1/02-task-delivery-protocol"],
  ["docs/bluebook/part-1/02-task-delivery-protocol.md", "/bluebook/part-2/03-work-environment-architecture"],
]
```

第 8 章之后直接进入第 10 章；第 13 章、结语和附录的尾链保持连贯。

- [ ] **步骤 3：同步 PDF manifest 与书签标题**

将 `scripts/bluebook-v2-manifest.json` 的 `items` 按同一顺序排列，并把案例项的显示标题改为“案例与场景图谱”。不修改 `docs/public/downloads/qwenwork-bluebook-v1.pdf` 和 `qwenwork-bluebook-v1.3.pdf`。

- [ ] **步骤 4：运行结构测试**

运行：`node --test tests/content-utils.test.mjs`

预期：sidebar 数量仍为 21，next-chain 通过，旧兼容页测试通过。

- [ ] **步骤 5：Commit 导航和 manifest**

```bash
git add scripts/bluebook-v2-manifest.json scripts/content-utils.mjs tests/content-utils.test.mjs docs/bluebook
git commit -m "refactor(导航): 调整 V2 为案例优先顺序"
```

## 任务 5：重写方法章节的首屏，不删除技术细节

**文件：**
- 修改：`docs/bluebook/part-1/01-delivery-standard.md`
- 修改：`docs/bluebook/part-1/02-task-delivery-protocol.md`
- 修改：`docs/bluebook/part-2/03-work-environment-architecture.md`
- 修改：`docs/bluebook/part-2/04-skills-connectors-expert-kits.md`
- 修改：`docs/bluebook/part-2/05-automation-boundaries.md`
- 修改：`docs/bluebook/part-3/06-office-delivery.md`
- 修改：`docs/bluebook/part-3/07-role-roadmaps.md`
- 修改：`docs/bluebook/part-3/08-research-evidence-chain.md`

- [ ] **步骤 1：统一方法页首屏结构**

每页前 80–120 行按以下顺序改写，不移除正文中的 claim 锚点：

```md
## 30 秒说明

一句话说明普通办公用户能用本页完成什么。

## 你可能遇到的场景

一个具体任务和常见卡点。

## 交付后应该看到什么

明确文件、表格、PPT、报告或网页等产物。

## 先做这 3–6 步

可直接照做的步骤。

## 再深入理解

链接到工作流、Skill、连接器、证据或自动化边界。
```

- [ ] **步骤 2：为每页加入相近案例链接**

交付页链接品胜/优克拉或 32 场景中相近任务；研究页链接竞品调研和经营分析场景；办公交付页链接文档、表格、PPT、会议和网页案例。

- [ ] **步骤 3：统一术语首现解释**

首次出现时采用“普通说法（技术术语）”格式，例如“可以重复使用的一套做法（工作流）”“允许 AI 访问某个系统的授权通道（连接器）”。后续页面可直接使用术语。

- [ ] **步骤 4：运行内容校验**

运行：`npm run check:content`

预期：所有 claim、来源、兼容页和证据计数通过。

- [ ] **步骤 5：Commit 方法层**

```bash
git add docs/bluebook/part-1 docs/bluebook/part-2 docs/bluebook/part-3
git commit -m "docs(正文): 将方法章节改为任务导向"
```

## 任务 6：把阶段、治理和权限放到团队落地路径

**文件：**
- 修改：`docs/bluebook/part-4/10-pilot-roadmap.md`
- 修改：`docs/bluebook/part-4/11-security-governance.md`
- 修改：`docs/bluebook/part-4/12-workflow-operations.md`
- 修改：`docs/bluebook/part-4/13-value-measurement.md`
- 修改：`docs/bluebook/conclusion-product-ecosystem.md`
- 修改：`docs/bluebook/index.md`

- [ ] **步骤 1：保留治理完整性，改写入口语气**

每页第一屏先回答普通用户“为什么需要这一层”：例如“当 AI 要读取员工资料、写入系统或影响他人时，必须先把责任说清楚”。随后再进入 G0–G3、数据敏感度、审批人、回退和度量公式。

- [ ] **步骤 2：把治理页面标记为团队落地路径**

在蓝皮书首页和首页阅读路径中，将阶段、治理、权限、证据台账和价值度量归入“准备团队使用”，不放在普通用户第一入口中。

- [ ] **步骤 3：运行完整检查**

运行：`npm run check`

预期：98 个以上测试全部通过，内容校验通过，VitePress 构建完成。

- [ ] **步骤 4：Commit 治理层**

```bash
git add docs/bluebook/part-4 docs/bluebook/conclusion-product-ecosystem.md docs/bluebook/index.md
git commit -m "docs(治理): 将团队落地内容后置"
```

## 任务 7：重建 V2 PDF 并完成视觉与链接 QA

**文件：**
- 修改：`docs/public/downloads/qwenwork-bluebook-v2.0.pdf`
- 修改：`docs/bluebook/releases/v2.0-pdf-qa.md`
- 生成：`docs/.vitepress/dist/**`

- [ ] **步骤 1：生成证据附录并构建网站**

运行：`npm run generate:evidence && npm run build`

预期：生成页与 JSON 一致，VitePress 构建成功。

- [ ] **步骤 2：重建 PDF**

运行：`npm run build:bluebook-pdf`

预期：PDF metadata 标题为“千问办公蓝皮书 V2.0”，manifest 顺序与网站一致，V1/V1.3 PDF hash 不变。

- [ ] **步骤 3：执行机器 QA**

运行：`npm test && npm run check:content && npm run check && git diff --check`

预期：全部命令退出码为 0；V2 书签、21 个入口、旧 URL 兼容页、案例计数和证据锚点全部通过。

- [ ] **步骤 4：执行逐页视觉 QA**

使用现有 PDF 渲染脚本将 V2 PDF 渲染为 PNG，重点检查：序章后是否立即进入案例、案例页是否有足够留白和清晰层级、技术表格是否集中在后半部分、治理页是否仍可读。记录页数、书签数量、外链数量和异常页到 `docs/bluebook/releases/v2.0-pdf-qa.md`。

- [ ] **步骤 5：Commit PDF 与 QA**

```bash
git add docs/public/downloads/qwenwork-bluebook-v2.0.pdf docs/bluebook/releases/v2.0-pdf-qa.md
git commit -m "build(PDF): 重建普通用户阅读顺序"
```

## 任务 8：发布前线上验证

- [ ] **步骤 1：检查本地工作树和变更范围**

运行：`git status --short --branch` 和 `git diff --stat HEAD~1`

预期：只包含本计划列出的入口、正文、导航、manifest、测试和 PDF 文件。

- [ ] **步骤 2：推送分支并等待远端检查**

运行：`git push --set-upstream origin codex/qwenworkguide-v2-content`，创建合并请求，等待 Quality 与 Cloudflare Pages 检查通过。

- [ ] **步骤 3：合并并等待 GitHub Pages**

合并到 `main` 后等待 `Deploy GitHub Pages` 成功，记录部署 run URL 和 main commit。

- [ ] **步骤 4：访问线上入口**

验证以下 URL 返回 200 且包含目标内容：

```text
https://mickyzhou-glitch.github.io/QwenWorkGuide/
https://mickyzhou-glitch.github.io/QwenWorkGuide/bluebook/
https://mickyzhou-glitch.github.io/QwenWorkGuide/cases/
https://mickyzhou-glitch.github.io/QwenWorkGuide/bluebook/part-3/09-public-case-atlas
https://qwenworkguide.pages.dev/
```

- [ ] **步骤 5：Commit 发布记录**

```bash
git add docs/bluebook/releases/v2.0.md docs/bluebook/releases/v2.0-pdf-qa.md
git commit -m "docs(发布): 记录普通用户阅读版上线验证"
```
