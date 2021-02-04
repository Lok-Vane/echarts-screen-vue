<template>
  <div class="com-container">
    <div class="com-chart" ref="stockRef"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null, // echart实例
      data: [], // 请求的数据
      currentPageIndex: 1, // 当前页数
      totalPageLength: 0,// 总页数
      interval: null,
      api: new this.$api(),
    }
  },

  computed: {
    currentData () {
      return this.data.slice(5 * (this.currentPageIndex - 1), 5 * this.currentPageIndex);
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
      this.chartInstance = this.$echarts.init(this.$refs.stockRef, this.$store.state.theme);
      // 初始化option配置
      const initOption = {
        title: {
          text: '▍库存与销量',
          left: 20,
          top: 20
        },
      };
      this.chartInstance.setOption(initOption);
      // 图标对象 监听鼠标移入移除
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.interval);
      });
      this.chartInstance.on('mouseout', this.startinterval);
    },

    // 请求数据
    async getData () {
      this.$showLoading(this.chartInstance);
      this.data = await this.$http.get(this.api.stock);
      this.$hideLoading(this.chartInstance);
      this.updateChart();
      this.startinterval();
    },

    // 更新视图
    updateChart () {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%'],
      ];
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ];
      const yu = this.data.length % 5;
      this.totalPageLength = (this.data.length - yu) / 5 + (yu > 0 ? 1 : 0);
      const SeriesArr = this.currentData.map((item, index) => {
        return {
          type: 'pie',
          center: centerArr[index],
          hoverAnimation: false, // 取消鼠标动画
          labelLine: {
            show: false, // 取消指示线
          },
          label: {
            position: 'center', // 文字居中
            color: colorArr[index][0],
          },
          data:
            [
              {
                name: item.name + '\n\n销量：' + item.sales + '\n\n库存：' + item.stock,
                value: item.sales,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, // x1 y1 x2 y2 指明渐变方向
                    [
                      {
                        offset: 0,
                        color: colorArr[index][0]
                      },
                      {
                        offset: 1,
                        color: colorArr[index][1]
                      }
                    ])
                }
              },
              {
                value: item.stock,
                itemStyle: {
                  color: '#333'
                }
              }
            ]
        };
      });
      const dataOption = {
        series: SeriesArr
      };
      this.chartInstance.setOption(dataOption);
    },

    // resize监听事件 配置分辨率
    screenAdapter () {
      const width = this.$refs.stockRef.offsetWidth;
      const titleFontSize = width / 100 * 3.6;
      const SeriesArr = this.currentData.map(item => {
        return {
          radius: [titleFontSize * 2.5, titleFontSize * 3],
          label: {
            textStyle: {
              fontSize: titleFontSize / 3
            }
          },
        };
      });
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: SeriesArr
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },

    startinterval () {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        if (this.currentPageIndex < this.totalPageLength) {
          this.currentPageIndex++;
        } else if (this.currentPageIndex === this.totalPageLength) {
          this.currentPageIndex = 1;
        }
      }, 3000);
    }
  }
}
</script>

<style lang="less" scoped>
</style>