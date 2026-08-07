# 面向普通办公用户的 V2 阅读体验实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans` 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将 QwenWorkGuide V2 的阅读顺序改为“基本介绍 → 案例与场景 → 方法与操作 → 阶段、治理、权限与深入资料”，并补强普通办公用户真正需要的场景、产物、步骤和证据边界。

**架构：** 保留所有旧 URL、历史 PDF、证据台账和结构化案例数据，只调整读者入口、导航顺序和正文叙事。网站与新 PDF 使用同一份 V2 manifest；案例正文负责建立兴趣和复用感，证据台账负责决定“已核验公开案例”统计，两者不混为一谈。

**技术栈：** Markdown、VitePress 1.6.4、Node.js `node:test`、确定性 PDF 构建脚本、现有内容和证据校验脚本。

---

## 文件职责

### 阅读入口

- 修改：`docs/index.md` — 首页任务入口、基本介绍和读者路径。
- 修改：`docs/bluebook/index.md` — 蓝皮书目录、篇章顺序和阅读路径。
- 修改：`docs/bluebook/executive-summary.md` — 普通用户能看懂的全书摘要、适用任务和边界。

### 案例与场景

- 修改：`docs/cases/index.md` — 案例库首页和证据状态说明。
- 修改：`docs/cases/submissions/pisen-competitive-research-product-materials.md` — 品胜案例正文。
- 修改：`docs/cases/submissions/youkela-product-rd-payroll.md` — 优克拉案例正文。
- 修改：`docs/cases/submissions/qwenwork-public-case-atlas.md` — 32 个公开场景图谱。
- 修改：`docs/bluebook/part-3/09-public-case-atlas.md` — 蓝皮书案例章节和可阅读案例入口。

### 方法与专业任务

- 修改：`docs/bluebook/part-1/01-delivery-standard.md` — 把“完成工作”解释成普通用户可执行的交付步骤。
- 修改：`docs/bluebook/part-1/02-task-delivery-protocol.md` — 任务卡、验收和返工控制。
- 修改：`docs/bluebook/part-2/03-work-environment-architecture.md` — 用选择工作入口替代架构先行。
- 修改：`docs/bluebook/part-2/04-skills-connectors-expert-kits.md` — 用普通语言解释 Skill、连接器和可复用资产。
- 修改：`docs/bluebook/part-2/05-automation-boundaries.md` — 从重复工作和接管场景讲自动化边界。
- 修改：`docs/bluebook/part-3/06-office-delivery.md` — 文档、表格、汇报和网页任务的操作路径。
- 修改：`docs/bluebook/part-3/07-role-roadmaps.md` — 按岗位和任务选择阅读路径。
- 修改：`docs/bluebook/part-3/08-research-evidence-chain.md` — 从“查资料并形成结论”讲来源与证据。

### 阶段、治理与深入资料

- 修改：`docs/bluebook/part-4/10-pilot-roadmap.md` — 从小范围试用进入 30/60/90 天阶段。
- 修改：`docs/bluebook/part-4/11-security-governance.md` — 从具体动作和风险讲权限、人机责任和回退。
- 修改：`docs/bluebook/part-4/12-workflow-operations.md` — 从团队复用和维护讲运营。
- 修改：`docs/bluebook/part-4/13-value-measurement.md` — 从“有没有帮上忙”讲可复算度量。
- 修改：`docs/bluebook/conclusion-product-ecosystem.md` — 用读者下一步行动收束全文。
- 保留并补入口：`docs/bluebook/appendices/*.md` — 模板、来源、证据和治理细节作为深入资料。

### 导航、构建与测试

- 修改：`scripts/content-utils.mjs` — V2 canonical path 顺序、下一章链和侧边栏分组。
- 修改：`scripts/bluebook-v2-manifest.json` — PDF 书签和打印顺序。
- 修改：`tests/content-utils.test.mjs` — 阅读顺序、案例入口和页面内容硬门。
- 生成：`docs/bluebook/appendices/evidence-ledger.md`、`docs/bluebook/appendices/case-source-map.md` — 只通过 `npm run generate:evidence` 更新，不手工编辑。
- 生成：`docs/.vitepress/dist/`、`docs/public/downloads/qwenwork-bluebook-v2.0.pdf` — 构建与 PDF QA 产物。

## 任务 1：先写读者体验回归测试

**文件：**
- 修改：`tests/content-utils.test.mjs`

- [ ] **步骤 1：写失败测试，锁定“先介绍、再案例、后治理”的行为**

在现有测试文件中加入以下测试。`docsRoot` 已在文件顶部定义，`manifestPath` 使用 `join(dirname(docsRoot), "scripts/bluebook-v2-manifest.json")`：

```js
test("reader-first entry pages and manifest lead with basics and cases", async () => {
  const home = await readFile(join(docsRoot, "index.md"), "utf8");
  const bluebookIndex = await readFile(
    join(docsRoot, "bluebook/index.md"),
    "utf8",
  );
  const manifest = JSON.parse(
    await readFile(
      join(dirname(docsRoot), "scripts/bluebook-v2-manifest.json"),
      "utf8",
    ),
  );

  assert.match(home, /你今天想把哪件办公工作做完/);
  assert.match(home, /写一份汇报或周报/);
  assert.match(home, /整理一次会议/);
  assert.match(home, /做一张表或分析一批数据/);
  assert.match(bluebookIndex, /基本介绍/);
  assert.match(bluebookIndex, /案例与场景图谱/);
  assert.match(bluebookIndex, /阶段、治理、权限与组织落地/);
  assert.deepEqual(
    manifest.items.slice(0, 6).map((item) => item.id),
    [
      "executive-summary",
      "chapter-09",
      "chapter-06",
      "chapter-07",
      "chapter-08",
      "chapter-01",
    ],
  );
});
```

- [ ] **步骤 2：运行测试确认失败**

运行：`node --test tests/content-utils.test.mjs`

预期：FAIL；当前首页没有六项任务入口，manifest 仍以 `chapter-01` 开始。

- [ ] **步骤 3：Commit 测试基线**

```bash
git add tests/content-utils.test.mjs
git commit -m "test(阅读体验): 锁定普通用户入口顺序"
```

## 任务 2：重写首页、蓝皮书首页和执行摘要

**文件：**
- 修改：`docs/index.md`
- 修改：`docs/bluebook/index.md`
- 修改：`docs/bluebook/executive-summary.md`
- 测试：`tests/content-utils.test.mjs`

- [ ] **步骤 1：改首页首屏和六个任务入口**

首页保留项目名称、非官方提示和 PDF 下载，但在 hero 下方增加以下用户语言的任务卡：

```markdown
## 你今天想把哪件办公工作做完？

先从一件具体的事开始。做完之后，再决定要不要把这套做法留给团队。

- **写一份汇报或周报**：从零散进展整理成有重点、可修改的初稿。
- **整理一次会议**：把记录变成结论、待办、负责人和截止时间。
- **做一张表或分析一批数据**：先统一口径，再生成可检查的表格和结论。
- **做一份 PPT 或产品物料**：先出结构和草稿，再由人确认事实、品牌和表达。
- **查资料并形成研究结论**：保留来源、日期和不确定的地方。
- **做一个网页或内容草稿**：先完成可预览版本，再检查素材、权限和发布动作。
```

入口卡片必须链接到实际可阅读页面，并在卡片上写清“会得到什么”，避免只写功能名。

- [ ] **步骤 2：改蓝皮书首页目录说明**

把“从这里开始”和目录改成四层阅读路径：基本介绍、案例与场景、方法与操作、阶段治理与深入资料。保留所有章节 URL 和旧版 PDF 链接；篇章名称用普通读者能理解的动词和结果描述。

- [ ] **步骤 3：重写执行摘要开头**

执行摘要先回答三件事：千问办公适合帮什么忙、一次任务怎样算做完、哪些地方必须由人确认。第一屏使用一个周报或会议整理的小例子，再引出“交付、复用、治理”三个抽象概念。

首屏必须包含一段类似下面的读者语言，并把术语解释放在后面：

```markdown
如果你第一次使用千问办公，可以先把它当成一个会帮你整理资料、搭好初稿、找出遗漏的工作助手。它能让你更快得到一个可修改的版本，但不能替你确认事实、决定口径或代表你把内容发出去。
```

- [ ] **步骤 4：运行入口测试和内容校验**

运行：`node --test tests/content-utils.test.mjs`

预期：入口测试通过；旧的现有测试保持通过。

运行：`npm run check:content`

预期：`正式内容校验通过`、`案例校验通过`。

- [ ] **步骤 5：Commit**

```bash
git add docs/index.md docs/bluebook/index.md docs/bluebook/executive-summary.md tests/content-utils.test.mjs
git commit -m "docs(入口): 改为普通办公用户任务路径"
```

## 任务 3：夯实案例与场景层

**文件：**
- 修改：`docs/cases/index.md`
- 修改：`docs/cases/submissions/pisen-competitive-research-product-materials.md`
- 修改：`docs/cases/submissions/youkela-product-rd-payroll.md`
- 修改：`docs/cases/submissions/qwenwork-public-case-atlas.md`
- 修改：`docs/bluebook/part-3/09-public-case-atlas.md`
- 测试：`tests/content-utils.test.mjs`

- [ ] **步骤 1：为每个案例固定“问题—产物—做法—边界”顺序**

每个案例开头必须依次出现：原来的麻烦、最后得到的产物、3–6 个复用步骤、客户陈述或公开场景的证据边界。不要把“案例来源映射、发布门、外部记录 ID”放在案例正文第一段；这些内容放在案例结尾和蓝皮书深入阅读中。

- [ ] **步骤 2：恢复并夯实两个具名案例**

保留品胜和优克拉的原始场景、客户陈述结果、输入、步骤和验收条件；每个案例增加一个“如果你要复用”小节，明确哪些输入必须替换、哪些结果不能照搬、谁需要人工确认。不得新增未出现在现有案例材料中的客户事实或数字。

- [ ] **步骤 3：夯实 32 个场景图谱**

保留五类场景分类和 32 个任务名称；每类增加“适合什么人、需要准备什么、先做哪个最小试点、交付物长什么样”四列式说明。继续标注待核验，不把 32 个候选提升为已核验公开案例。

- [ ] **步骤 4：在蓝皮书第 9 章前置可阅读案例**

第 9 章先提供案例入口和阅读方法，再解释为何证据门统计为 0。保留逐条发布门、证据状态和案例来源映射，但不让统计表成为读者第一次看到的内容。

- [ ] **步骤 5：运行案例回归测试**

运行：`node --test tests/content-utils.test.mjs`

预期：案例标题、客户陈述、32 个场景、证据边界和第 9 章案例入口测试全部通过。

运行：`npm run check:content`

预期：案例正文完整、公开案例计数仍与 JSON 一致，正式内容校验通过。

- [ ] **步骤 6：Commit**

```bash
git add docs/cases docs/bluebook/part-3/09-public-case-atlas.md tests/content-utils.test.mjs
git commit -m "docs(案例): 强化场景叙事与复用边界"
```

## 任务 4：调整 V2 导航和 PDF 顺序

**文件：**
- 修改：`scripts/content-utils.mjs`
- 修改：`scripts/bluebook-v2-manifest.json`
- 修改：`docs/bluebook/index.md`
- 修改：15 个 V2 canonical Markdown 页面底部的“下一章”链接。
- 测试：`tests/content-utils.test.mjs`

- [ ] **步骤 1：把 canonical path 顺序改成读者顺序**

`BLUEBOOK_V2_PATHS` 和 manifest `items` 使用同一顺序：

```text
executive-summary
chapter-09
chapter-06
chapter-07
chapter-08
chapter-01
chapter-02
chapter-03
chapter-04
chapter-05
chapter-10
chapter-11
chapter-12
chapter-13
conclusion
appendix-prompts
appendix-scenarios
appendix-launch
appendix-sources
appendix-evidence
appendix-cases
```

- [ ] **步骤 2：调整下一章链和侧边栏分组**

`BLUEBOOK_V2_NEXT_CHAIN` 必须严格反映上述 15 个正文页面顺序；侧边栏分组改为“序章”“先看案例与场景”“从任务到交付”“专业办公任务”“团队落地”“结语”“附录”。旧路径和兼容页面不删除。

- [ ] **步骤 3：更新目录页面**

`docs/bluebook/index.md` 的篇章说明和目录必须与 sidebar、manifest、next chain 一致；案例链接出现在方法和治理章节之前。

- [ ] **步骤 4：先运行导航测试确认全部链路**

运行：`node --test tests/content-utils.test.mjs`

预期：如果只更新 path 顺序而没有同步 next links，测试应明确报告下一章链失败；补齐 15 个页面后全部通过。

- [ ] **步骤 5：Commit**

```bash
git add scripts/content-utils.mjs scripts/bluebook-v2-manifest.json docs/bluebook tests/content-utils.test.mjs
git commit -m "docs(导航): 调整 V2 普通用户阅读顺序"
```

## 任务 5：补强方法与专业任务正文

**文件：**
- 修改：`docs/bluebook/part-1/01-delivery-standard.md`
- 修改：`docs/bluebook/part-1/02-task-delivery-protocol.md`
- 修改：`docs/bluebook/part-2/03-work-environment-architecture.md`
- 修改：`docs/bluebook/part-2/04-skills-connectors-expert-kits.md`
- 修改：`docs/bluebook/part-2/05-automation-boundaries.md`
- 修改：`docs/bluebook/part-3/06-office-delivery.md`
- 修改：`docs/bluebook/part-3/07-role-roadmaps.md`
- 修改：`docs/bluebook/part-3/08-research-evidence-chain.md`

- [ ] **步骤 1：统一页面开头顺序**

每页开头按以下 Markdown 结构重排，不删除现有证据和边界：

```markdown
## 30 秒结论

## 你可能遇到的场景

## 最后会得到什么

## 照着做

## 案例参考

## 做完检查

## 需要注意

## 深入阅读
```

- [ ] **步骤 2：补实操细节**

每页至少补齐一个具体输入、一个中间检查点、一个最终产物结构和一个失败时的回退动作。使用既有案例和官方来源中的事实，不新增未经来源核验的效果数字。

- [ ] **步骤 3：把术语翻译成动作**

首次出现的术语使用“普通解释 + 原术语”的格式，例如：“可重复使用的一套做法（工作流）”“能帮你把资料送到另一个工具的授权通道（连接器）”。技术细节链接到相应附录。

- [ ] **步骤 4：加入案例交叉链接**

文档任务链接品胜或优克拉，研究任务链接 32 场景图谱，岗位路线链接对应任务卡；链接文字使用“看一个例子”或具体案例名，不使用孤立的“案例与证据”。

- [ ] **步骤 5：运行内容校验并 Commit**

运行：`npm test && npm run check:content`

预期：98 个以上测试通过，正式内容校验和案例校验通过。

```bash
git add docs/bluebook/part-1 docs/bluebook/part-2 docs/bluebook/part-3 tests/content-utils.test.mjs
git commit -m "docs(方法): 补强普通办公任务的操作细节"
```

## 任务 6：把阶段、治理和权限放到深入阅读层

**文件：**
- 修改：`docs/bluebook/part-4/10-pilot-roadmap.md`
- 修改：`docs/bluebook/part-4/11-security-governance.md`
- 修改：`docs/bluebook/part-4/12-workflow-operations.md`
- 修改：`docs/bluebook/part-4/13-value-measurement.md`
- 修改：`docs/bluebook/conclusion-product-ecosystem.md`
- 修改：`docs/bluebook/appendices/prompt-templates.md`
- 修改：`docs/bluebook/appendices/launch-checklist.md`

- [ ] **步骤 1：为治理章节增加普通用户入口**

每个治理章节开头先回答“什么时候需要读这一章”，例如：

```markdown
如果你只是整理自己的周报，可以先跳过本章；当任务涉及团队共享、敏感资料、自动发送或跨系统写入时，再回到这里确认边界。
```

- [ ] **步骤 2：用具体动作解释阶段和权限**

将 G0–G3、30/60/90 天、审批角色、持续授权等内容都配一个普通办公动作例子，并明确“谁确认、确认什么、失败如何停下来”。表格保留，但表格前先给一句结论。

- [ ] **步骤 3：把证据和度量连接回案例**

每章至少链接一个案例或任务图谱，说明读者何时需要记录输入版本、人工修改、异常和结果，而不是先展示字段名。

- [ ] **步骤 4：运行全量检查并 Commit**

运行：`npm run check`

预期：测试、内容校验、案例校验和 VitePress 构建全部通过。

```bash
git add docs/bluebook/part-4 docs/bluebook/conclusion-product-ecosystem.md docs/bluebook/appendices
git commit -m "docs(治理): 将阶段权限改写为深入阅读"
```

## 任务 7：生成 PDF、执行视觉 QA 并准备发布

**文件：**
- 生成：`docs/public/downloads/qwenwork-bluebook-v2.0.pdf`
- 生成：`docs/bluebook/releases/v2.0-pdf-qa.md`
- 生成：`docs/bluebook/appendices/evidence-ledger.md`
- 生成：`docs/bluebook/appendices/case-source-map.md`

- [ ] **步骤 1：重新生成证据附录**

运行：`npm run generate:evidence`

预期：生成页面与结构化 JSON 一致，且 `npm run check:evidence` 通过。

- [ ] **步骤 2：构建 V2 PDF**

运行：`npm run build:bluebook-pdf`

预期：PDF 成功生成，标题为“千问办公蓝皮书 V2.0”，书签和章节顺序与 manifest 一致。

- [ ] **步骤 3：运行机器校验**

运行：`npm run check && git diff --check`

预期：所有测试、内容校验、案例校验、构建和空白检查通过；V1/V1.3 PDF SHA-256 不变。

- [ ] **步骤 4：执行逐页视觉 QA**

检查首页、执行摘要、案例图谱、案例页、方法页、治理页、附录和 PDF 目录页，重点确认：标题不被截断、任务卡可读、长表格不溢出、案例链接有效、技术术语没有压满首屏。

- [ ] **步骤 5：Commit QA 记录**

```bash
git add docs/public/downloads/qwenwork-bluebook-v2.0.pdf docs/bluebook/releases/v2.0-pdf-qa.md docs/bluebook/appendices
git commit -m "build(PDF): 完成普通用户阅读版 QA"
```

## 任务 8：线上发布与回归验证

- [ ] **步骤 1：推送分支并创建 PR**

```bash
git push --set-upstream origin codex/qwenworkguide-reader-first
gh pr create --base main --head codex/qwenworkguide-reader-first --title "docs: 改为普通办公用户阅读路径" --body "按基本介绍、案例与场景、方法与操作、阶段治理与深入资料重排 V2；保留旧 URL、历史 PDF、案例证据边界，并完成内容、PDF 与线上回归。"
```

- [ ] **步骤 2：等待远端 Quality 和 Cloudflare Pages 检查**

运行：`gh pr checks --watch --interval 10`

预期：所有检查成功后才允许合并。

- [ ] **步骤 3：合并并等待 GitHub Pages 部署**

运行：`gh pr merge --squash --delete-branch=false`

随后运行：`gh run list --workflow deploy-pages.yml --branch main --limit 1`，等待部署成功。

- [ ] **步骤 4：线上回归**

逐一检查以下地址返回 200 且内容正确：

- `https://mickyzhou-glitch.github.io/QwenWorkGuide/`
- `https://mickyzhou-glitch.github.io/QwenWorkGuide/cases/`
- `https://mickyzhou-glitch.github.io/QwenWorkGuide/bluebook/executive-summary`
- `https://mickyzhou-glitch.github.io/QwenWorkGuide/bluebook/part-3/09-public-case-atlas`
- `https://qwenworkguide.pages.dev/`
- `https://qwenworkguide.pages.dev/cases/`

首页必须出现普通办公任务入口，案例库必须出现品胜、优克拉和 32 个场景图谱；蓝皮书案例章节必须同时出现可阅读案例入口和证据统计边界。

## 计划自检

- 规格中的四层阅读顺序由任务 2、3、5、6 和 7 覆盖。
- 规格中的案例证据边界由任务 3、6 和 8 覆盖。
- 规格中的语言和视觉规则由任务 2、3、5、6 和 7 覆盖。
- 规格中的导航、PDF、旧 URL 和 QA 要求由任务 4、7、8 覆盖。
- 计划不新增客户故事、量化效果或未经核验的来源。
- 计划没有未定义的代码函数、测试工具或输出路径。
