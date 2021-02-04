<!-- 路由 /mappage -->

<template>
  <div class="com-page mappage">
    <Single-Map></Single-Map>
  </div>
</template>

<script>
export default {
  name: 'mappage',
  components: {
    'Single-Map': () => import('@/components/Map.vue'), // 组件懒加载
  }
}
</script>

<style lang="less" scoped>
</style>
