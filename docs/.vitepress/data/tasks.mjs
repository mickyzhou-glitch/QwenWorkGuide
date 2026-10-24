export const tasks = [
  { id: 'meeting-notes', number: '01', title: '把会议变成行动清单', category: '日常办公', format: '纪要 · 待办表', description: '从转写里分清结论、争议和待办，让下一步有据可查。', keywords: '会议 纪要 录音 听记 待办 meeting', link: '/tasks/meeting-notes' },
  { id: 'data-analysis', number: '02', title: '做一份可信的数据分析', category: '数据与研究', format: 'Excel · 分析摘要', description: '先核对表格口径，再找变化、解释异常、生成图表。', keywords: '表格 数据 Excel CSV xlsx 经营 财务 分析', link: '/tasks/data-analysis' },
  { id: 'presentation', number: '03', title: '把零散材料做成汇报', category: '日常办公', format: 'PPT · 讲述提纲', description: '从汇报对象和核心结论出发，做好结构，再完成排版。', keywords: 'PPT pptx 幻灯片 周报 汇报 Word 文档', link: '/tasks/presentation' },
  { id: 'research', number: '04', title: '做有来源的竞品研究', category: '数据与研究', format: '对照表 · 研究报告', description: '统一比较维度，给关键结论留来源，分清事实与推测。', keywords: '研究 调研 搜索 竞品 行业 research', link: '/tasks/research' },
  { id: 'team-workspace', number: '05', title: '搭一个团队协作网页', category: '协作与经营', format: '网页 · 共享工作台', description: '用模拟数据先跑通收集、查看和更新，再验证权限。', keywords: '网页 HTML 网站 数据库 多人 工作台 协作', link: '/tasks/team-workspace' },
  { id: 'commerce', number: '06', title: '把店铺数据变成复盘', category: '协作与经营', format: '经营复盘 · 优化清单', description: '先用导出数据完成一轮分析，再按账号条件连接商家后台。', keywords: '电商 淘宝 天猫 经营 ROI 商品 运营 商家', link: '/tasks/commerce' },
]

export const categories = ['全部', ...new Set(tasks.map(task => task.category))]

export function filterTasks(query = '', category = '全部') {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
  return tasks.filter(task => {
    const text = [task.title, task.description, task.keywords, task.format, task.category].join(' ').toLocaleLowerCase()
    return (category === '全部' || category === task.category) && terms.every(term => text.includes(term))
  })
}
