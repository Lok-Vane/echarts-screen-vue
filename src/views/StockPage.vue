<!-- 路由 /stockpage -->

<template>
  <div class="com-page stockpage">
    <Stock></Stock>
  </div>
</template>

<script>
export default {
  name: 'stockpage',
  components: {
    Stock: () => import('@/components/Stock.vue'), // 组件懒加载
  }
}
</script>

<style lang="less" scoped>
</style>
