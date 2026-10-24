<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
const { page, frontmatter } = useData()
const isBluebook = computed(() => page.value.relativePath.startsWith('bluebook/') && !frontmatter.value.canonical)
const isCurrent = computed(() => /^(guides|tasks|updates)\//.test(page.value.relativePath))
</script>
<template>
  <aside v-if="isBluebook" class="page-context">
    <strong>蓝皮书 · 2026 年 8 月方法参考</strong>
    <span>产品范围已有更新。<a :href="withBase('/guides/capabilities')">查看当前能力指南</a>，或阅读<a :href="withBase('/updates/')">更新记录</a>。</span>
  </aside>
  <div v-else-if="isCurrent" class="page-context page-context--current">
    <span>{{ frontmatter.status === 'verified' ? '公开资料核验' : '社区实践指南' }} · {{ frontmatter.verifiedAt }}</span>
    <a :href="withBase('/reading-guide')">如何使用这份指南</a>
  </div>
</template>
