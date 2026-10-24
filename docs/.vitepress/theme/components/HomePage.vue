<script setup>
import { withBase } from 'vitepress'
import TaskExplorer from './TaskExplorer.vue'
</script>

<template>
  <div class="guide-home">
    <section class="guide-hero" aria-labelledby="home-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="edition-dot" /> QWEN WORK GUIDE · 社区实践指南</p>
        <h1 id="home-title">少一点摸索，<br />把工作<span>真正做完。</span></h1>
        <p class="hero-description">千问办公的能力在更新，你的工作方法也可以。<br class="desktop-break" />从一件具体任务开始，把输入变成可检查、可继续编辑的成果。</p>
        <div class="hero-actions">
          <a class="guide-button primary" :href="withBase('/guides/quick-start')">完成第一个任务 <span aria-hidden="true">→</span></a>
          <a class="guide-button secondary" href="#choose-task">按任务找方法</a>
        </div>
        <p class="hero-footnote">独立维护 · 非官方项目 · 2026 年 10 月内容更新</p>
      </div>
      <aside class="workflow-preview" aria-label="会议纪要任务示例">
        <div class="preview-heading"><span>今天，从这件小事开始</span><span class="preview-tag">示例</span></div>
        <div class="preview-request">“把这份会议记录，整理成一页纪要和一张行动清单。”</div>
        <ol class="preview-steps">
          <li><span class="step-number">1</span><div><strong>提供材料</strong><small>会议记录 + 参会名单</small></div></li>
          <li><span class="step-number">2</span><div><strong>明确产物</strong><small>结论、负责人、截止日期</small></div></li>
          <li><span class="step-number">3</span><div><strong>核对后交付</strong><small>事实可追溯，未定事项不编造</small></div></li>
        </ol>
        <a class="preview-result" :href="withBase('/tasks/meeting-notes')"><span><strong>会议纪要 + 行动清单</strong><small>查看完整做法</small></span><span aria-hidden="true">↗</span></a>
      </aside>
    </section>

    <a class="update-strip" :href="withBase('/updates/')">
      <span class="update-label">更新观察</span>
      <span>移动端、多人工作台、技能分享、电商模式——新能力怎么用？</span>
      <span class="update-date">核验于 10.25 <span aria-hidden="true">→</span></span>
    </a>

    <section id="choose-task" class="home-section" aria-labelledby="task-title">
      <div class="section-heading"><div><p class="eyebrow">START WITH A TASK</p><h2 id="task-title">今天，你想完成什么？</h2></div><p>选一个任务，带走一套做法。</p></div>
      <TaskExplorer />
    </section>

    <section class="home-section" aria-labelledby="route-title">
      <div class="section-heading"><div><p class="eyebrow">FIND YOUR NEXT STEP</p><h2 id="route-title">从能用，到用得顺手</h2></div></div>
      <div class="route-grid">
        <a :href="withBase('/guides/capabilities')"><span class="route-number">01 / 认识能力</span><h3>选对入口，少走弯路</h3><p>网页端、桌面端、手机和 IM，各自适合什么任务。</p><span class="route-link">查看能力地图 →</span></a>
        <a :href="withBase('/guides/extensions')"><span class="route-number">02 / 复用方法</span><h3>让好方法下次还能用</h3><p>理解技能、连接器、专家套件，再考虑记忆和定时任务。</p><span class="route-link">了解扩展与复用 →</span></a>
        <a :href="withBase('/guides/team-adoption')"><span class="route-number">03 / 团队落地</span><h3>把个人实践带给团队</h3><p>选一个试点，定好检查方式，用实际成果衡量收益。</p><span class="route-link">开始团队试点 →</span></a>
      </div>
    </section>

    <section class="home-library" aria-labelledby="library-title">
      <div><p class="eyebrow">GO DEEPER</p><h2 id="library-title">需要完整方法？<br />蓝皮书仍然在这里。</h2><p>保留任务交付、组织治理、价值衡量与案例证据。<br />V2.0 PDF 是 2026 年 8 月历史快照；当前产品变化请看更新页。</p></div>
      <div class="library-links"><a :href="withBase('/bluebook/')">深入阅读蓝皮书 <span aria-hidden="true">↗</span></a><a :href="withBase('/cases/')">查看案例与证据 <span aria-hidden="true">↗</span></a><a :href="withBase('/community/contributing')">参与共创与勘误 <span aria-hidden="true">↗</span></a></div>
    </section>
    <p class="home-disclaimer">本项目不代表千问办公或阿里巴巴官方立场。方法为社区实践，功能与权益请结合官方说明及当前账号确认。</p>
  </div>
</template>
