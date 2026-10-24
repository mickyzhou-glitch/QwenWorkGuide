# 指南重构实施计划

**目标：** 将资料型站点重构为可直接上手的任务指南，并完成双站发布。

**架构：** 新指南和任务内容使用 Markdown；任务索引使用单一数据文件；Vue 组件只处理导航和本地筛选。既有蓝皮书证据体系继续独立校验。

**技术栈：** VitePress 1.6、Vue 3、Node.js 22、GitHub Pages、Cloudflare Pages。

- [x] 新增 docs/.vitepress/data/tasks.mjs：统一任务标题、类型、链接与关键词；tests/task-catalog.test.mjs 验证中文、英文、组合筛选及空状态。
- [x] 新增 HomePage.vue、TaskExplorer.vue、PageContext.vue 并更新主题样式；链接使用 withBase，不访问网络、不保存用户输入；输入有标签，筛选按钮有按下状态，计数使用礼貌播报。
- [x] 重写首页、快速开始、阅读指南；新增 docs/tasks 下六个实操页及 docs/guides 下能力说明；新增 docs/updates/index.md 记录公开更新和核验范围。
- [x] 更新导航、README 与蓝皮书历史说明；移除蓝皮书首页原生绝对链接，兼容页保持不变。
- [x] 新增 scripts/check-site.mjs：扫描构建 HTML 中全部站内链接和锚点，禁止越过部署子路径；执行 npm run check，随后 CF_PAGES=1 npm run build 并按根路径再检查。
- [ ] 检查改动与公开资料边界，合并 main 并推送；等待 GitHub Actions 成功，通过 HTTP 检查两站首页、任务页、更新页与 PDF，更新发布记录。

浏览器入口在本次环境被禁用；通过源代码、SSR 结果和 HTTP 验证，最终报告需保留这一限制。
