<template>
  <div class="com-container">
    <div class="com-chart" ref="rankRef"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null, // echart实例
      data: null, // 请求的数据
      interval: null,
      api: new this.$api(),
      dataZoom_start: 0, // 区域缩放起点
      dataZoom_end: 0, // 区域缩放终点 
      dataZoom_length: 0
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

  watch: {
    dataZoomOption () {
      this.chartInstance.setOption(this.dataZoomOption);
    },
    '$store.state.theme': function () {
      this.chartInstance.dispose(); // 销毁当前图表
      this.initChart(); // 重新初始化图表
      this.updateChart();
      this.screenAdapter();
    }
  },

  computed: {
    dataZoomOption () {
      return {
        dataZoom: {
          startValue: this.dataZoom_start,
          endValue: this.dataZoom_end
        },
      }
    }
  },

  methods: {
    // 初始化chart，需要获取DOM元素，所以在mounted之后调用
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.rankRef, this.$store.state.theme);
      // 初始化option配置
      const initOption = {
        title: {
          text: '▍地区销售排行',
          top: 20,
          left: 20
        },
        tooltip: {},
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          type: 'bar'
        }]
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
      this.data = await this.$http.get(this.api.rank);
      this.$hideLoading(this.chartInstance);
      this.data.sort((a, b) => {
        return b.value - a.value; // 从大到小排序
      });
      this.updateChart();
      this.startInterval();
    },

    // 更新视图
    updateChart () {
      const provinceArr = [];
      const valueArr = [];
      for (const item of this.data) {
        provinceArr.push(item.name);
        valueArr.push(item.value);
      }
      this.dataZoom_length = provinceArr.length;
      this.dataZoom_start = 0;
      this.dataZoom_end = Number((this.dataZoom_length / 2).toFixed(0)) - 1;
      const dataOption = {
        dataZoom: {
          show: false, // 隐藏拖动条
          startValue: this.dataZoom_start,
          endValue: this.dataZoom_end
        }, // 区域缩放
        xAxis: {
          data: provinceArr
        },
        series: [{
          data: valueArr,
          itemStyle: {
            color: arg => {
              const colorArr = [
                ['rgba(11, 168, 44, 0.5)', 'rgba(11, 168, 44, 0)'],
                ['rgba(44, 110, 255, 0.5)', 'rgba(44, 110, 255, 0)'],
                ['rgba(22, 242, 217, 0.5)', 'rgba(22, 242, 217, 0)'],
                ['rgba(254, 33, 30, 0.5)', 'rgba(254, 33, 30, 0)'],
                ['rgba(250, 105, 0, 0.5)', 'rgba(250, 105, 0, 0)'],
              ];
              let targetColor;
              if (arg.value > 300) {
                targetColor = colorArr[0];
              } else if (arg.value > 200) {
                targetColor = colorArr[1];
              } else if (arg.value > 100) {
                targetColor = colorArr[2];
              } else {
                targetColor = colorArr[3];
              }
              return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, // x1 y1 x2 y2 指明渐变方向
                [
                  {
                    offset: 0,
                    color: targetColor[0]
                  },
                  {
                    offset: 1,
                    color: targetColor[1]
                  }
                ]);
            }
          }
        }],
      };
      this.chartInstance.setOption(dataOption);
    },

    // resize监听事件 配置分辨率
    screenAdapter () {
      const width = this.$refs.rankRef.offsetWidth;
      const titleFontSize = width / 100 * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0], // 左上、右上、右下、左下  圆角
            }
          }
        ]
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },

    startInterval () {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        if (this.dataZoom_end < this.dataZoom_length - 1) {
          this.dataZoom_start++;
          this.dataZoom_end++;
        } else {
          this.dataZoom_start = 0;
          this.dataZoom_end = Number((this.dataZoom_length / 2).toFixed(0)) - 1;
        }
      }, 3000);
    }
  }
}
</script>

<style lang="less" scoped>
</style>