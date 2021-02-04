<!-- 路由 /trendpage -->

<template>
  <div class="com-page trendpage">
    <Trend></Trend>
  </div>
</template>

<script>
export default {
  name: 'trendpage',
  components: {
    Trend: () => import('@/components/Trend.vue'), // 组件懒加载
  }
}
</script>

<style lang="less" scoped>
</style>
