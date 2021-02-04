<template>
  <div class="com-container hot">
    <div class="extendbox">
      <div @click="previous" class="left arrow" :style="left_arrow_style"></div>
      <div @click="next" class="right arrow" :style="right_arrow_style"></div>
      <h5
        v-if="data.length"
        class="category-name"
        :style="{
          fontSize: `${titleFontSize}px`,
          color: $store.state.theme === 'chalk' ? '#fff' : '#333',
        }"
      >
        {{ currentData.name }}
      </h5>
    </div>
    <div class="com-chart" ref="hotRef"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null, // echart实例
      data: [], // 请求的数据
      currentDataIndex: 0, // 当前显示数据页数
      api: new this.$api(),
      titleFontSize: 0
    }
  },

  computed: {
    currentData () {
      return this.data[this.currentDataIndex];
    },
    left_arrow_style () {
      return {
        opacity: this.currentDataIndex > 0 ? 1 : 0,
        width: `${this.titleFontSize}px`,
        height: `${this.titleFontSize}px`,
        borderWidth: `${this.titleFontSize / 5}px`,
        marginLeft: `${this.titleFontSize}px`,
        borderColor: this.$store.state.theme === 'chalk' ? '#fff' : '#333'
      };
    },
    right_arrow_style () {
      return {
        opacity: this.currentDataIndex < this.data.length - 1 ? 1 : 0,
        width: `${this.titleFontSize}px`,
        height: `${this.titleFontSize}px`,
        borderWidth: `${this.titleFontSize / 5}px`,
        marginRight: `${this.titleFontSize}px`,
        borderColor: this.$store.state.theme === 'chalk' ? '#fff' : '#333'
      };
    },
  },

  watch: {
    currentDataIndex () {
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
    window.removeEventListener('resize', this.screenAdapter); // 注销事件，防止内存泄漏
  },

  methods: {
    // 初始化chart，需要获取DOM元素，所以在mounted之后调用
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.hotRef, this.$store.state.theme);
      // 初始化option配置
      const initOption = {
        title: {
          text: '▍热销商品',
          left: 20,
          top: 20
        },
        legend: {
          icon: 'circle',
          left: '8%',
          bottom: '7%',
          orient: 'vertical', // 图例垂直摆放
        },
        tooltip: {
          formatter (item) {
            let _tooltip = `
            <strong style="color:red">${item.name}：${item.value}，占比${item.percent}%</strong><br/>
            <span>下属分类</span><br/>
            `;
            for (let index in item.data.children) {
              const child = item.data.children[index];
              _tooltip += `
              <span>${++index}）${child.name}：${child.value}，占比${child.percent}%</span><br/>
              `;
            }
            return _tooltip;
          }
        },
        series: [
          {
            type: 'pie',
            // roseType: 'area',
            center: ["50%", "50%"],
            radius: ["40%", "60%"],
            label: {
              show: false // 默认隐藏名称
            },
            emphasis: { // 高亮 类似hover
              label: {
                show: true,
                textStyle: {
                  fontSize: 50
                }
              }
            },
          },
        ]
      };
      this.chartInstance.setOption(initOption);
    },

    // 请求数据
    async getData () {
      this.$showLoading(this.chartInstance);
      this.data = await this.$http.get(this.api.hotproduct);
      this.$hideLoading(this.chartInstance);
      this.updateChart();
    },

    // 更新视图
    updateChart () {
      const seriesData = [];
      const legendData = [];
      for (const item of this.currentData.children) {
        let total = 0; // 总数
        for (const child of item.children) {
          total += child.value;
        }
        let _children = item.children.map(child => {
          return {
            name: child.name,
            value: child.value,
            percent: Number((child.value / total * 100).toFixed(2)) // 百分比
          };
        });
        seriesData.push({
          name: item.name,
          value: item.value,
          children: _children // 第三级分类，可在tooltip.formatter中获取
        });
        legendData.push(item.name);
      }
      const dataOption = {
        series: [
          {
            data: seriesData
          }
        ],
        legend: {
          data: legendData
        }
      };
      this.chartInstance.setOption(dataOption);
    },

    // resize监听事件 配置分辨率
    screenAdapter () {
      const width = this.$refs.hotRef.offsetWidth;
      this.titleFontSize = width / 100 * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: [
          {
            emphasis: { // 高亮 类似hover
              label: {
                textStyle: {
                  fontSize: this.titleFontSize / 2
                }
              },
            },
          }
        ],
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },

    // 下一页
    next () {
      if (this.currentDataIndex < this.data.length - 1) {
        this.currentDataIndex++;
      }
    },

    // 上一页
    previous () {
      if (this.currentDataIndex > 0) {
        this.currentDataIndex--;
      }
    },
  }
}
</script>

<style lang="less" scoped>
.hot {
  position: relative;
  .extendbox {
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .arrow {
      width: 0px;
      height: 0px;
      display: inline-block;
      position: relative;
      z-index: 9;
      cursor: pointer;
      transition: all 0.3s linear;
      transform: rotate(45deg);
    }
    .left {
      border-left: 0px solid;
      border-bottom: 0px solid;
      margin-left: 0px;
    }
    .right {
      border-right: 0px solid;
      border-top: 0px solid;
      margin-right: 0px;
    }
    .category-name {
      position: absolute;
      z-index: 9;
      right: 10%;
      bottom: 5%;
      color: #fff;
    }
  }
}
</style>