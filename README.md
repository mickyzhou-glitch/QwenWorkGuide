# QwenWorkGuide

非官方、开源、社区共创的千问办公实践指南：从一句话，到可交付的工作系统。

在线阅读：<https://mickyzhou-glitch.github.io/QwenWorkGuide/>

> QwenWorkGuide 不代表千问办公、阿里巴巴或其关联方的官方立场；产品能力以官方资料和实际可用界面为准。

## 你能在这里读到什么

- 完整蓝皮书 V2：执行摘要、13 章交付与组织规范、结语和 6 个附录；
- 指令模板、场景速查和上线验收清单；
- 可公开复现的社区案例与投稿模板；
- 来源、核验日期、隐私与安全边界。

建议新读者先读[执行摘要](docs/bluebook/executive-summary.md)，再从[阅读指南](docs/reading-guide.md)选择路径；想立即试做一个任务，可从[快速开始](docs/guides/quick-start.md)开始。

## 本地运行

```bash
npm install
npm run dev
npm run check
```

## Cloudflare Pages

推荐使用 Cloudflare Pages 的 GitHub 集成，连接仓库
`mickyzhou-glitch/QwenWorkGuide`。构建配置如下：

- 生产分支：`main`
- 框架预设：VitePress
- 构建命令：`npm run build`
- 构建输出目录：`docs/.vitepress/dist`
- 根目录：留空

Cloudflare Pages 构建环境会自动注入 `CF_PAGES=1`，站点据此使用根路径 `/`；
GitHub Pages 构建继续使用 `/QwenWorkGuide/`，两种托管方式可以并存。

## 参与共创

你可以提交勘误、补充经过来源核验的内容，或投稿已脱敏、可复现的案例。详细流程见 [CONTRIBUTING.md](CONTRIBUTING.md)，案例正文从 [.github/CASE_TEMPLATE.md](.github/CASE_TEMPLATE.md) 开始。

请勿提交客户隐私、企业内部资料、账号口令、访问令牌、未授权截图或无法公开的原始文件。

## 许可证与商标

- 代码、构建脚本与配置： [MIT](LICENSE)
- QwenWorkGuide 创作的文档文字： [CC BY 4.0](LICENSE-DOCS.md)

第三方图片、商标和引用材料不因上述许可证自动获得再许可。千问办公及相关商标归其各自权利人所有。
