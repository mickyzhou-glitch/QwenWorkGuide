import { defineConfig } from 'vitepress'
import { BLUEBOOK_V2_SIDEBAR_GROUPS } from '../../scripts/content-utils.mjs'
import { GUIDE_SIDEBAR, TASK_SIDEBAR } from './navigation.mjs'

const isCloudflarePages = process.env.CF_PAGES === '1'
const siteBase = isCloudflarePages ? '/' : '/QwenWorkGuide/'
const canonicalOrigin = 'https://qwenworkguide.pages.dev'

export default defineConfig({
  lang: 'zh-CN',
  title: 'QwenWorkGuide',
  description: '从一个任务开始，学会使用千问办公。包含上手练习、任务实操、能力说明与产品更新。非官方社区指南。',
  base: siteBase,
  head: [
    ['meta', { name: 'theme-color', content: '#176b4b' }],
    ['link', { rel: 'icon', href: `${siteBase}q-logo.svg`, type: 'image/svg+xml' }]
  ],
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['superpowers/**'],
  transformPageData(pageData) {
    const { canonical, robots } = pageData.frontmatter
    if (canonical === undefined && robots === undefined) return

    const head = pageData.frontmatter.head ?? []
    if (canonical !== undefined) {
      head.push([
        'link',
        {
          rel: 'canonical',
          href: new URL(canonical, canonicalOrigin).href
        }
      ])
    }
    if (robots !== undefined) {
      head.push(['meta', { name: 'robots', content: robots }])
    }
    pageData.frontmatter.head = head
  },
  // 离线蓝皮书文件在构建文档后由发布流程放入 public/downloads。
  ignoreDeadLinks: [
    '/downloads/qwenwork-bluebook-v1.pdf',
    '/downloads/qwenwork-bluebook-v1.3.pdf'
  ],
  themeConfig: {
    logo: '/q-logo.svg',
    nav: [
      { text: '开始使用', link: '/guides/quick-start', activeMatch: '/guides/quick-start' },
      { text: '任务实战', link: '/tasks/', activeMatch: '/tasks/' },
      { text: '能力指南', link: '/guides/capabilities', activeMatch: '/guides/(?!quick-start)' },
      { text: '产品更新', link: '/updates/' },
      { text: '深入阅读', items: [
        { text: '蓝皮书 · 方法与实践', link: '/bluebook/' },
        { text: '案例与证据', link: '/cases/' },
        { text: '阅读指南', link: '/reading-guide' },
        { text: '参与共创', link: '/community/contributing' },
        { text: '联系作者', link: '/contact' }
      ] }
    ],
    sidebar: {
      '/bluebook/': BLUEBOOK_V2_SIDEBAR_GROUPS,
      '/guides/': GUIDE_SIDEBAR,
      '/tasks/': TASK_SIDEBAR,
      '/updates/': GUIDE_SIDEBAR,
      '/cases/': [{ text: '案例与来源', items: [
        { text: '案例库与阅读边界', link: '/cases/' },
        { text: '品胜 · 研究与物料', link: '/cases/submissions/pisen-competitive-research-product-materials' },
        { text: '优克拉 · 研发与薪资', link: '/cases/submissions/youkela-product-rd-payroll' },
        { text: '公开场景线索', link: '/cases/submissions/qwenwork-public-case-atlas' },
        { text: '回到任务实战', link: '/tasks/' }
      ] }]
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
    footer: {
      message: '非官方社区项目 · 代码 MIT / 原创文档 CC BY 4.0',
      copyright: 'QwenWorkGuide · 以具体任务，连接新的工作方法'
    },
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
