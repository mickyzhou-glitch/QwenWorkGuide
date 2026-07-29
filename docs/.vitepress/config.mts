import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'QwenWorkGuide',
  description: '非官方、开源、社区共创的千问办公实践指南',
  base: '/QwenWorkGuide/',
  head: [
    ['meta', { name: 'theme-color', content: '#102a43' }],
    ['link', { rel: 'icon', href: '/QwenWorkGuide/favicon.svg', type: 'image/svg+xml' }]
  ],
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['superpowers/**'],
  // 离线蓝皮书文件在构建文档后由发布流程放入 public/downloads。
  ignoreDeadLinks: [
    '/downloads/qwenwork-bluebook-v1.docx',
    '/downloads/qwenwork-bluebook-v1.pdf'
  ],
  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      { text: '蓝皮书', link: '/bluebook/' },
      { text: '案例库', link: '/cases/' },
      { text: '阅读指南', link: '/reading-guide' },
      { text: '参与共创', link: '/community/contributing' }
    ],
    sidebar: {
      '/bluebook/': [
        {
          text: '第一篇 重新理解 AI 办公',
          collapsed: false,
          items: [
            { text: '从回答问题到交付结果', link: '/bluebook/part-1/01-from-answer-to-delivery' },
            { text: '三端一体', link: '/bluebook/part-1/02-three-surfaces' },
            { text: '六层能力架构', link: '/bluebook/part-1/03-capability-architecture' }
          ]
        },
        {
          text: '第二篇 先把千问办公用起来',
          items: [
            { text: '完成第一项任务', link: '/bluebook/part-2/04-first-task' },
            { text: 'Skill、连接器与专家套件', link: '/bluebook/part-2/05-skills-connectors-experts' },
            { text: '自动化', link: '/bluebook/part-2/06-automation' }
          ]
        },
        {
          text: '第三篇 真实工作流案例',
          items: [
            { text: '办公交付', link: '/bluebook/part-3/07-office-delivery' },
            { text: '岗位路线', link: '/bluebook/part-3/08-role-roadmaps' }
          ]
        },
        {
          text: '第四篇 企业落地与商业化',
          items: [
            { text: '组织落地', link: '/bluebook/part-4/09-organization-rollout' },
            { text: '安全与治理', link: '/bluebook/part-4/10-security-governance' },
            { text: '价值度量', link: '/bluebook/part-4/11-value-measurement' },
            { text: '产品与生态建议', link: '/bluebook/part-4/12-product-ecosystem' }
          ]
        },
        {
          text: '附录',
          items: [
            { text: '指令模板', link: '/bluebook/appendices/prompt-templates' },
            { text: '场景速查', link: '/bluebook/appendices/scenario-index' },
            { text: '上线验收', link: '/bluebook/appendices/launch-checklist' },
            { text: '来源', link: '/bluebook/appendices/sources' }
          ]
        }
      ],
      '/guides/': [
        { text: '上手指南', items: [{ text: '快速开始', link: '/guides/quick-start' }] }
      ]
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除查询条件',
            backButtonTitle: '关闭搜索',
            noResultsText: '未找到相关结果',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '回车',
              navigateText: '切换',
              navigateUpKeyAriaLabel: '向上箭头',
              navigateDownKeyAriaLabel: '向下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'Esc'
            }
          }
        }
      }
    },
    editLink: {
      pattern: 'https://github.com/mickyzhou-glitch/QwenWorkGuide/edit/main/docs/:path',
      text: '在 GitHub 上编辑本页'
    },
    docFooter: {
      prev: '上一章',
      next: '下一章'
    },
    lastUpdated: {
      text: '最后更新'
    },
    outline: {
      label: '本页内容'
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '打开章节导航',
    darkModeSwitchLabel: '切换外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳到正文',
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/mickyzhou-glitch/QwenWorkGuide'
      }
    ]
  }
})
