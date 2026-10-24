import { tasks } from './data/tasks.mjs'

export const GUIDE_SIDEBAR = [
  { text: '开始使用', items: [
    { text: '完成第一个任务', link: '/guides/quick-start' },
    { text: '能力地图与入口选择', link: '/guides/capabilities' },
  ] },
  { text: '用得更顺手', items: [
    { text: '技能、连接器与专家套件', link: '/guides/extensions' },
    { text: '让重复任务按时完成', link: '/guides/automation' },
    { text: '把个人实践带给团队', link: '/guides/team-adoption' },
    { text: '常见问题与排障', link: '/guides/troubleshooting' },
  ] },
  { text: '继续探索', items: [
    { text: '按任务找方法', link: '/tasks/' },
    { text: '产品更新与阅读提示', link: '/updates/' },
    { text: '蓝皮书 · 深入方法', link: '/bluebook/' },
  ] },
]

export const TASK_SIDEBAR = [{ text: '任务实战', items: [
  { text: '全部任务', link: '/tasks/' },
  ...tasks.map(task => ({ text: task.title, link: task.link })),
] }, { text: '遇到问题', items: [
  { text: '常见问题与排障', link: '/guides/troubleshooting' },
  { text: '能力地图', link: '/guides/capabilities' },
] }]
