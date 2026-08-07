import { defineConfig } from 'vitepress'
import { BLUEBOOK_V2_SIDEBAR_GROUPS } from '../../scripts/content-utils.mjs'

const isCloudflarePages = process.env.CF_PAGES === '1'
const siteBase = isCloudflarePages ? '/' : '/QwenWorkGuide/'
const canonicalOrigin = 'https://qwenworkguide.pages.dev'

export default defineConfig({
  lang: 'zh-CN',
  title: 'QwenWorkGuide',
  description: '非官方、开源、社区共创的千问办公实践指南',
  base: siteBase,
  head: [
    ['meta', { name: 'theme-color', content: '#4ce285' }],
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
      { text: '蓝皮书', link: '/bluebook/' },
      { text: '案例库', link: '/cases/' },
      { text: '阅读指南', link: '/reading-guide' },
      { text: '参与共创', link: '/community/contributing' },
      { text: '联系我', link: '/contact' }
    ],
    sidebar: {
      '/bluebook/': BLUEBOOK_V2_SIDEBAR_GROUPS,
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
