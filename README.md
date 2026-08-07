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
