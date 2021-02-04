<!-- 路由 /rankpage -->

<template>
  <div class="com-page rankpage">
    <Rank></Rank>
  </div>
</template>

<script>
export default {
  name: 'rankpage',
  components: {
    Rank: () => import('@/components/Rank.vue'), // 组件懒加载
  }
}
</script>

<style lang="less" scoped>
</style>
