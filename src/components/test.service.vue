<template>
  <div class="com-container">
    <div class="com-chart" ref="trendRef"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null, // echart实例
      data: null, // 请求的数据
      //   currentPageIndex: 1, // 当前页数
      //   totalPageLength: 0,// 总页数
      //   interval: null
      api: new this.$api(),
    }
  },

  async mounted () {
    this.initChart();
    await this.getData();
    // 自适应窗口大小
    this.screenAdapter(); // 立即执行一次
    window.addEventListener('resize', this.screenAdapter);
  },

  destroyed () {
    window.removeEventListener('resize', this.screenAdapter); // 注销事件，防止内存泄漏
  },

  methods: {
    // 初始化chart，需要获取DOM元素，所以在mounted之后调用
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.trendRef, 'chalk');
      // 初始化option配置
      const initOption = {
      };
      this.chartInstance.setOption(initOption);
    },

    // 请求数据
    async getData () {
      this.$showLoading(this.chartInstance);
      this.data = await this.$http.get(this.api.rank);
      this.$hideLoading(this.chartInstance);
      this.updateChart();
    },

    // 更新视图
    updateChart () {
      const dataOption = {};
      this.chartInstance.setOption(dataOption);
    },

    // resize监听事件 配置分辨率
    screenAdapter () {
      const adapterOption = {};
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  }
}
</script>

<style lang="less" scoped>
</style>