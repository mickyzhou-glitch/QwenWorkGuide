# QwenWorkGuide README 改写实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将根目录 README 改写为面向企业 AI 负责人、业务负责人和普通办公用户的通俗入口。

**架构：** 只修改 `README.md`，用「读者问题 → 适用人群 → 目标导航 → 内容证明」取代现有的「项目简介 → 内容清单 → 部署配置」。保留原有非官方声明、安全边界、本地命令、Cloudflare Pages 配置和许可证信息。

**技术栈：** Markdown、VitePress 1.6.4、Node.js 20–24。

---

## 文件结构

- 修改：`README.md` — GitHub 仓库首页的项目介绍、阅读导航、共创和开发说明。
- 不新增测试文件：复用 `npm run check` 的内容校验、Node.js 测试和 VitePress 构建，另用一次性 Node.js 脚本校验 README 本地链接。

### 任务 1：建立校验基线

**文件：**
- 检查：`README.md`
- 检查：`package.json`

- [ ] **步骤 1：运行现有全量检查**

运行：`npm run check`

预期：Node.js 测试全部通过，内容校验输出 `Content validation passed`、`Case validation passed`，VitePress 构建成功。

- [ ] **步骤 2：记录 README 的可验证事实**

使用以下仓库内容作为改写依据：

```text
完整蓝皮书：17 章
案例库：2 个具名客户深度案例（4 个业务场景）+ 32 个公开场景案例
离线版：V1.3 PDF，V1.2 PDF 存档
开发环境：Node.js >=20 <25
全量检查：npm run check
```

### 任务 2：改写 GitHub 仓库首页

**文件：**
- 修改：`README.md:1`

- [ ] **步骤 1：替换 README 全文**

将 `README.md` 替换为以下内容：

````markdown
# QwenWorkGuide

**一份帮你把 AI 办公从「能生成」做到「能交付」的开源实践指南。**

会让 AI 写文档、做表格，只是第一步。真正完成工作，还需要结果可编辑、数据可核对、流程可复用、风险有人把关。

QwenWorkGuide 是一份非官方、开源、社区共创的千问办公指南。它不只告诉你「能做什么」，还会说清楚「怎么做」、「怎么验收」和「怎么在团队里复用」。

[**在线阅读**](https://mickyzhou-glitch.github.io/QwenWorkGuide/) · [快速上手](docs/guides/quick-start.md) · [查看案例](docs/cases/index.md) · [下载 V1.3 PDF](https://mickyzhou-glitch.github.io/QwenWorkGuide/downloads/qwenwork-bluebook-v1.3.pdf)

> 本项目不代表千问办公、阿里巴巴或其关联方的官方立场。功能、价格、权益和可用范围请以官方资料及实际界面为准。

## 这份指南适合谁

- **企业 AI 负责人和业务负责人：** 找到值得试点的场景，建立验收、安全和价值衡量方法。
- **正在推进 AI 落地的团队：** 把一次成功的任务整理成可复用、可维护的工作流。
- **想先完成一件小事的办公用户：** 从低风险、容易检查的任务开始，一步步做出可用的结果。

## 你现在想解决什么

| 你的目标 | 推荐入口 |
| --- | --- |
| 第一次用，想在 1 小时内跑通一个任务 | [快速开始](docs/guides/quick-start.md) |
| 已经有具体任务，想找可参考的做法 | [社区案例库](docs/cases/index.md) 和 [场景速查](docs/bluebook/appendices/scenario-index.md) |
| 想学会写清需求，少返工 | [任务拆解与交付协议](docs/bluebook/part-2/13-task-delivery-protocol.md) 和 [常用指令模板](docs/bluebook/appendices/prompt-templates.md) |
| 准备在团队或企业中试点 | [组织落地](docs/bluebook/part-4/09-organization-rollout.md)、[安全治理](docs/bluebook/part-4/10-security-governance.md) 和 [上线验收](docs/bluebook/appendices/launch-checklist.md) |
| 想从头到尾了解完整方法 | [阅读完整蓝皮书](docs/bluebook/index.md) |

## 你能在这里找到什么

- **17 章完整蓝皮书：** 从完成第一个任务，到 Skill、自动化、团队运营和价值度量。
- **可参考的真实场景：** 已收录 2 个具名客户深度案例（4 个业务场景）和 32 个公开场景案例。
- **可直接改的工具：** 任务卡、指令模板、场景速查表和上线验收清单。
- **更适合团队落地的方法：** 如何选试点、分配责任、管理风险，以及判断是否值得继续投入。

案例和社区方法用来帮你形成试点假设，不代表所有企业都会得到同样的结果。

## 这份指南如何保持可信

我们尽量把「产品事实」和「社区经验」分开：

- 产品能力尽量附上官方来源和核验日期；
- 社区方法会说明适用条件和安全边界；
- 未经独立审计的量化结果，会明确标注为客户陈述；
- 产品更新后需要重新确认的内容，会标记为待复核。

更详细的说明见 [阅读指南](docs/reading-guide.md) 和 [来源与延伸阅读](docs/bluebook/appendices/sources.md)。

## 参与共创

欢迎提交勘误、补充有来源的内容，或投稿已脱敏、可复现的案例。详细流程见 [贡献指南](CONTRIBUTING.md)，案例正文可从 [案例模板](.github/CASE_TEMPLATE.md) 开始。

请勿提交客户隐私、企业内部资料、账号口令、访问令牌、未授权截图或无法公开的原始文件。

## 本地阅读与检查

需要 Node.js 20–24。

```bash
npm install
npm run dev
npm run check
```

<details>
<summary>Cloudflare Pages 部署配置</summary>

使用 Cloudflare Pages 的 GitHub 集成连接 `mickyzhou-glitch/QwenWorkGuide`：

- 生产分支：`main`
- 框架预设：VitePress
- 构建命令：`npm run build`
- 构建输出目录：`docs/.vitepress/dist`
- 根目录：留空

Cloudflare Pages 会自动注入 `CF_PAGES=1`，站点使用根路径 `/`。GitHub Pages 继续使用 `/QwenWorkGuide/`，两种托管方式可以并存。

</details>

## 许可证与商标

- 代码、构建脚本与配置：[MIT](LICENSE)
- QwenWorkGuide 创作的文档文字：[CC BY 4.0](LICENSE-DOCS.md)

第三方图片、商标和引用材料不因上述许可证自动获得再许可。千问办公及相关商标归其各自权利人所有。
````

- [ ] **步骤 2：检查 Markdown 变更**

运行：`git diff --check -- README.md`

预期：无输出，退出码为 0。

### 任务 3：验证链接、内容和构建

**文件：**
- 检查：`README.md`

- [ ] **步骤 1：校验 README 的本地链接**

运行：

```bash
node -e "const fs=require('fs');const text=fs.readFileSync('README.md','utf8');const links=[...text.matchAll(/\[[^\]]+\]\((?!https?:|#)([^)]+)\)/g)].map(m=>m[1]);const missing=links.filter(link=>!fs.existsSync(link));if(missing.length){console.error(missing.join('\n'));process.exit(1)}console.log('README local links passed:',links.length)"
```

预期：输出 `README local links passed: 17`。

- [ ] **步骤 2：运行全量检查**

运行：`npm run check`

预期：与基线一致，测试、内容校验和 VitePress 构建全部通过。

- [ ] **步骤 3：检查最终差异和仓库状态**

运行：`git diff -- README.md && git status --short`

预期：差异只包含 `README.md` 的预期改写和本计划文件，没有构建产物或无关文件。

- [ ] **步骤 4：提交实现**

```bash
git add README.md docs/superpowers/plans/2026-08-07-readme-refresh.md
git commit -m "docs(自述): 用通俗语言重写仓库首页"
```

预期：提交成功，提交中只包含 README 和实现计划。
