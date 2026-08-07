const groups = [
  [
    "数据、研究与经营决策",
    [
      ["ecommerce-operations-dashboard", "搭建电商经营数据看板"],
      ["ai-model-comparison-report", "产出主流 AI 模型对比报告"],
      ["ecommerce-data-analysis", "分析电商经营数据"],
      ["nvidia-financial-analysis", "分析英伟达财报"],
      ["multi-platform-product-selection", "抓取多平台数据用于电商选品"],
      ["multi-platform-operations-review", "复盘多平台经营数据并优化投放"],
      [
        "instant-retail-operations-review",
        "复盘闪购经营数据并识别爆品、低效品与断货损失",
      ],
      ["marketing-review-dashboard", "搭建营销复盘看板"],
      [
        "smartphone-competitive-research",
        "输出全球智能手机市场竞品调研报告",
      ],
    ],
  ],
  [
    "电商、闪购与直播运营",
    [
      ["product-video-analysis", "分析商品宣传视频并形成报告"],
      ["livestream-clip-analysis", "分析直播切片并拆解头部主播带货增长模型"],
      ["creator-matrix-dashboard", "搭建达人矩阵管理数据看板"],
      ["ecommerce-product-images", "批量生成电商上新商品图片"],
      ["instant-retail-product-listing", "用浏览器自动化完成闪购商品上下架"],
      [
        "instant-retail-campaign-costing",
        "按平台规则制作闪购活动策划并测算优惠成本",
      ],
      ["food-delivery-product-page", "设计外卖商品页面以提升吸引力与下单转化"],
    ],
  ],
  [
    "网站、营销与内容生产",
    [
      ["flower-shop-homepage", "生成花店商家宣传官网首页"],
      ["homestay-product-page", "搭建临海民宿产品介绍网页"],
      ["technology-company-homepage", "搭建科技公司动态官网首页"],
      ["marketing-plan", "生成营销策划方案"],
      ["scheduled-content-distribution", "定时多渠道分发营销内容"],
      ["multi-platform-marketing-assets", "批量生成多平台营销素材"],
      ["resume-website", "搭建求职简历网页"],
    ],
  ],
  [
    "教育与个人发展",
    [
      ["aircraft-engine-learning-site", "搭建飞机发动机教学网站"],
      ["classroom-materials", "设计课堂 PPT、教案和配套作业"],
      ["student-learning-analysis", "生成学情分析报告并支持定制辅导"],
      ["enrollment-page", "搭建招生宣传网页"],
      ["english-exam-plan", "整理中考英语百日备考方案"],
      ["thesis-outline", "设计论文初稿框架"],
    ],
  ],
  [
    "组织协同与人才管理",
    [
      [
        "dingtalk-document-to-todo",
        "调动钉钉完成从文档归纳到待办创建的系列任务",
      ],
      ["talent-pipeline-plan", "生成人才梯队发展规划"],
      ["campus-recruiting-dashboard", "搭建校招面试管理看板"],
    ],
  ],
];

export default {
  schema_version: 1,
  cases: groups.flatMap(([bookCategory, items]) =>
    items.map(([slug, originalName]) => ({
      case_id: `case-${slug}`,
      original_name: originalName,
      original_tags: ["结构校验夹具"],
      book_category: bookCategory,
      source_ref: "R11",
      external_record_id: null,
      deep_link: null,
      snapshot_path: null,
      content_hash: null,
      verified_at: "2026-08-01",
      verification_status: "pending",
      included_in_public_count: false,
      artifact_links: [],
      limitations: ["测试夹具不用于公开案例计数。"],
    })),
  ),
};
