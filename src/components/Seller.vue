<template>
  <div class="com-container">
    <div class="com-chart" ref="sellerRef"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null, // echart实例
      data: null, // 请求的数据
      currentPageIndex: 1, // 当前页数
      totalPageLength: 0,// 总页数
      interval: null,
      api: new this.$api(),
    }
  },

  watch: {
    currentPageIndex () {
      this.updateChart();
    },
    '$store.state.theme': function () {
      this.chartInstance.dispose(); // 销毁当前图表
      this.initChart(); // 重新初始化图表
      this.updateChart();
      this.screenAdapter();
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
    clearInterval(this.interval);
    window.removeEventListener('resize', this.screenAdapter); // 注销事件，防止内存泄漏
  },

  methods: {
    // 初始化chart，需要获取DOM元素，所以在mounted之后调用
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef, this.$store.state.theme);
      // 初始化option配置
      const initOption = {
        title: {
          text: '▍商家销售统计',
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // 包含坐标轴文字位置
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
        },
        tooltip: {
          // 鼠标移入展示
          trigger: 'axis',
          axisPointer: {
            z: 0, // 层级0
            type: 'line',
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            label: {
              // 数据文字
              show: true,
              position: 'right',
              textStyle: {
                color: '#fff'
              },
            },
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, // x1 y1 x2 y2 指明渐变方向
                [
                  // 百分之0状态之下的颜色值
                  {
                    offset: 0,
                    color: '#5052EE'
                  },
                  // 百分之100状态之下的颜色值
                  {
                    offset: 1,
                    color: '#AB6EE5'
                  }
                ])
            }
          }
        ]
      };
      this.chartInstance.setOption(initOption);
      // 图标对象 监听鼠标移入移除
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.interval);
      });
      this.chartInstance.on('mouseout', this.startInterval);
    },

    // 请求数据
    async getData () {
      this.$showLoading(this.chartInstance);
      this.data = await this.$http.get(this.api.seller);
      this.$hideLoading(this.chartInstance);
      this.data.sort((a, b) => {
        return a.value - b.value; // 从小到大排序
      });
      this.totalPageLength = this.data.length % 5 === 0 ? this.data.length / 5 : this.data.length / 5 + 1;
      this.updateChart();
      this.startInterval();
    },

    // 更新视图
    updateChart () {
      const dataOption = {
        yAxis: {
          data: this.showData.sellerNames
        },
        series: [
          {
            data: this.showData.sellerValues,
          }
        ]
      };
      this.chartInstance.setOption(dataOption);
    },

    // 启动定时器
    startInterval () {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.currentPageIndex = this.currentPageIndex % this.totalPageLength + 1;
      }, 5000);
    },

    // resize监听事件 配置分辨率
    screenAdapter () {
      const width = this.$refs.sellerRef.offsetWidth;
      const titleFontSize = width / 100 * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          lineStyle: {
            width: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0], // 左上、右上、右下、左下  圆角
            }
          }
        ]
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    }
  },

  computed: {
    showData () {
      // 截取五条数据
      const currentData = this.data.slice(5 * (this.currentPageIndex - 1), 5 * this.currentPageIndex);
      const sellerNames = [];
      const sellerValues = [];
      for (const item of currentData) {
        sellerNames.push(item.name);
        sellerValues.push(item.value);
      }
      return { sellerNames, sellerValues };
    },
  },
}
</script>

<style lang="less" scoped>
</style>
