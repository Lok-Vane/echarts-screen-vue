<!-- 路由 /hotpage -->

<template>
  <div class="com-page hotpage">
    <Hot></Hot>
  </div>
</template>

<script>
export default {
  name: 'hotpage',
  components: {
    'Hot': () => import('@/components/Hot.vue'), // 组件懒加载
  }
}
</script>

<style lang="less" scoped>
</style>
