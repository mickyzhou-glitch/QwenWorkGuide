# QwenWorkGuide

**少一点摸索，把工作真正做完。**

一份非官方、开源的千问办公实践指南。从具体任务开始，提供准备材料、操作步骤、可复制指令与结果检查方法，再逐步理解能力和团队落地。

[**在线阅读**](https://qwenworkguide.pages.dev/) · [GitHub Pages 备用站](https://mickyzhou-glitch.github.io/QwenWorkGuide/) · [完成第一个任务](docs/guides/quick-start.md) · [产品更新](docs/updates/index.md)

> 本项目由社区独立维护，不代表千问办公或阿里巴巴官方立场。功能、开放范围、价格和权益以官方说明、当前账号及合同为准。

## 2026 年 10 月版

本轮资料核验于 **2026-10-25**，官方客户端日志核对至 **2026-10-15 / 1.3.1**。产品更新与本站版本分开记录，详见[更新与阅读提示](docs/updates/index.md)。

- **从练习开始：** 用虚构的会议记录完成一次“输入 → 生成 → 核对 → 保存”。
- **按任务找做法：** 六类独立实操，支持站内关键词搜索与分类筛选。
- **读懂新能力：** 移动入口、多人工作台、技能分享、电商模式、记忆与安全中心。
- **明确运行条件：** 区分本地与云端定时任务，说明邀测、权限与尚未上线的能力。
- **蓝皮书同步：** V2.1 更新全部 13 章并提供新版 PDF；增加 13 条公开案例资料，旧 PDF 和证据台账继续保留。

## 今天要做什么

| 目标 | 实操入口 | 带走什么 |
| --- | --- | --- |
| 整理会议 | [会议纪要](docs/tasks/meeting-notes.md) | 一页纪要、行动表、待确认项 |
| 分析数据 | [可信的数据分析](docs/tasks/data-analysis.md) | 工作簿、图表、口径说明 |
| 制作汇报 | [材料变成汇报](docs/tasks/presentation.md) | 可编辑 PPT 与讲述提纲 |
| 调研竞品 | [有来源的研究](docs/tasks/research.md) | 对照表、来源清单、研究摘要 |
| 团队协作 | [协作网页](docs/tasks/team-workspace.md) | 工作台原型与权限验证方法 |
| 电商经营 | [店铺复盘](docs/tasks/commerce.md) | 经营复盘与优化假设 |

## 按需要继续读

- **不确定用哪个入口：** [能力地图](docs/guides/capabilities.md)。
- **想复用工作方法：** [技能、连接器与专家套件](docs/guides/extensions.md)、[定时任务](docs/guides/automation.md)。
- **准备团队推广：** [小范围试点](docs/guides/team-adoption.md)。
- **遇到问题：** [常见问题与排障](docs/guides/troubleshooting.md)。
- **需要完整方法：** [蓝皮书](docs/bluebook/index.md)及[案例库](docs/cases/index.md)。

## 当前指南与历史资料

当前版为蓝皮书 V2.1（2026-10-25），[PDF](docs/public/downloads/qwenwork-bluebook-v2.1.pdf)同步 13 章与公开案例札记。历史 V2.0 PDF 保留 2026-08-01 快照，旧证据不追认。

公开案例源数据位于 `docs/cases/data/public-cases.json`。运行 `npm run generate:cases` 同步在线详情、目录和 PDF 附录；`npm run check:cases` 防止遗漏与重复计数；`npm run check:pdf` 比对正文与 PDF 的发布摘要，阻止不同步发布。运行 `npm run build:bluebook-pdf` 导出 V2.1；历史版本请使用对应历史提交重建。

案例库保留 2 个具名客户深度案例（4 个业务场景）与 32 个待核验场景线索。当前通过案例级发布门的公开案例为 0；这些材料不自动构成效果承诺。来源与核验状态见[证据台账](docs/bluebook/appendices/evidence-ledger.md)和[案例来源映射](docs/bluebook/appendices/case-source-map.md)。

## 本地开发与检查

需要 Node.js 20–24。

```bash
npm ci
npm run dev
npm run check
```

`check` 包含单元测试、内容与证据校验、生产构建、渲染后站内链接和锚点检查。根路径托管另行检查：

```bash
CF_PAGES=1 npm run build
CF_PAGES=1 npm run check:site
```

内容在 `docs/guides`、`docs/tasks`、`docs/updates`；任务索引在 `docs/.vitepress/data/tasks.mjs`；导航在 `docs/.vitepress/navigation.mjs`；组件与样式在 `docs/.vitepress/theme`。更新任务名称或路径时同时维护索引与页面，检查会验证它们一致。

## 发布

生产分支为 `main`。GitHub Actions 执行全部检查后部署到 `/QwenWorkGuide/`。Cloudflare Pages 使用 GitHub 集成，配置：

- 构建命令：`npm run check`
- 输出目录：`docs/.vitepress/dist`
- 根目录：仓库根目录
- `CF_PAGES=1` 由 Cloudflare 注入，使用 `/` 部署路径

已有 Cloudflare 项目若仍配置 `npm run build`，GitHub Quality 工作流仍会验证两种路径；调整控制台配置时建议使用上述完整检查命令。

## 共创与许可

欢迎通过 [Issue](https://github.com/mickyzhou-glitch/QwenWorkGuide/issues/new/choose)报告勘误，或按[贡献指南](CONTRIBUTING.md)补充有来源的内容。请勿提交客户私密材料、账号凭据或未获授权的截图。

代码与脚本采用 [MIT](LICENSE)，原创文档采用 [CC BY 4.0](LICENSE-DOCS.md)。第三方图片、商标和引用材料不因上述许可自动获得再许可。
