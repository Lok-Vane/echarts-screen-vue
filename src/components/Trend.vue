<template>
  <div class="com-container trend">
    <div class="title" v-show="selectValue">
      <i :style="selectStyle">▍</i>
      <select @change="updateChart" v-model="selectValue" :style="selectStyle">
        <option
          v-for="(item, index) in selectOptions"
          v-show="selectValue !== item.key"
          :key="index"
          :value="item.key"
        >
          {{ item.text }}
        </option>
      </select>
      <div class="arrow" :style="arrowStyle"></div>
    </div>
    <div class="com-chart" ref="trendRef"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null, // echart实例
      data: null, // 请求的数据
      selectValue: null,
      selectOptions: null,
      titleFontSize: 0,
      api: new this.$api(),
    }
  },

  computed: {
    selectStyle () {
      return {
        fontSize: `${this.titleFontSize}px`,
        color: this.$store.state.theme === 'chalk' ? '#fff' : '#333'
      };
    },
    arrowStyle () {
      return {
        width: `${this.titleFontSize / 2}px`,
        height: `${this.titleFontSize / 2}px`,
        borderWidth: `${this.titleFontSize / 8}px`,
        marginLeft: `${this.titleFontSize / 2}px`,
        borderColor: this.$store.state.theme === 'chalk' ? '#fff' : '#333'
      };
    }
  },

  watch: {
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
      this.chartInstance = this.$echarts.init(this.$refs.trendRef, this.$store.state.theme);
      // 初始化option配置
      const initOption = {
        grid: {
          top: '35%',
          left: '3%',
          right: '4%',
          bottom: '4%',
          containLabel: true // 包含坐标轴文字位置
        },
        tooltip: {
          // 鼠标移入展示
          trigger: 'axis',
        },
        legend: {
          left: 20,
          top: '20%',
          icon: 'circle',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false // 折线贴近y轴
        },
        yAxis: {
          type: 'value'
        }
      };
      this.chartInstance.setOption(initOption);
    },

    // 请求数据
    async getData () {
      this.$showLoading(this.chartInstance);
      this.data = await this.$http.get(this.api.trend);
      this.$hideLoading(this.chartInstance);
      this.selectOptions = this.data.type;
      this.selectValue = this.selectOptions[0].key;
      this.updateChart();
    },

    // 更新视图
    updateChart () {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ];
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ];
      const timeArr = this.data.common.month; // x轴
      // const valueArr = this.data[this.selectValue].data;
      const valueArr = Reflect.get(this.data, this.selectValue).data;
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.selectValue, // 设置堆叠名称
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, // x1 y1 x2 y2 指明渐变方向
              [
                {
                  offset: 0,
                  color: colorArr1[index]
                },
                {
                  offset: 1,
                  color: colorArr2[index]
                }
              ])
          }
        };
      });
      const legendArr = valueArr.map(item => item.name); // 图例名称
      const dataOption = {
        xAxis: {
          data: timeArr,
        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      };
      this.chartInstance.setOption(dataOption);
    },

    // resize监听事件 配置分辨率
    screenAdapter () {
      const width = this.$refs.trendRef.offsetWidth;
      this.titleFontSize = width / 100 * 3.6;
      const adapterOption = {
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
  }
}
</script>

<style lang="less" scoped>
.trend {
  position: relative;
  .title {
    position: absolute;
    z-index: 9;
    left: 20px;
    top: 20px;
    display: flex;
    align-items: center;
    i {
      color: #fff;
    }
    select {
      cursor: pointer;
      color: #fff;
      font-weight: 800;
      border: 0;
      appearance: none;
      -moz-appearance: none; /* Firefox */
      -webkit-appearance: none; /* Safari 和 Chrome */
      outline: none;
      background-color: transparent;
      option {
        color: #222733;
      }
    }
    .arrow {
      width: 0px;
      height: 0px;
      display: inline-block;
      position: relative;
      z-index: 9;
      transform: rotate(-45deg);
      border-left: 0px solid #fff;
      border-bottom: 0px solid #fff;
      margin-left: 0px;
    }
  }
}
</style>