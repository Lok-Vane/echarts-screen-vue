<!-- 路由 /sellerpage -->

<template>
  <div class="com-page sellerpage">
    <Seller></Seller>
  </div>
</template>

<script>
export default {
  name: 'sellerpage',
  components: {
    Seller: () => import('@/components/Seller.vue'), // 组件懒加载
  }
}
</script>

<style lang="less" scoped>
</style>
