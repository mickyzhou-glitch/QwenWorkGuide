import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'QwenWorkGuide',
  description: '非官方、开源、社区共创的千问办公实践指南',
  base: '/QwenWorkGuide/',
  cleanUrls: true,
  lastUpdated: true,
  // 离线蓝皮书文件在构建文档后由发布流程放入 public/downloads。
  ignoreDeadLinks: [
    '/downloads/qwenwork-bluebook-v1.docx',
    '/downloads/qwenwork-bluebook-v1.pdf'
  ],
  themeConfig: {
    search: {
      provider: 'local'
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/mickyzhou-glitch/QwenWorkGuide'
      }
    ]
  }
})
