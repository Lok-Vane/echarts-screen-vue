<template>
  <div id="app">
    <!-- 路由插座 -->
    <router-view></router-view>
  </div>
</template>

<style lang="less">
</style>

<script>
export default {
  created () {
    document.title = 'Echart数据大屏';
  }
}
</script>
