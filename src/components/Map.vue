<template>
  <div class="com-container" @dblclick="resetChinaMap">
    <!-- 监听escape键，恢复中国地图 -->
    <div
      class="com-chart"
      ref="mapRef"
      tabindex="1"
      @keyup.esc="resetChinaMap"
    ></div>
    <h5
      class="current-map"
      v-text="currentMapText"
      :style="{
        fontSize: `${titleFontSize}px`,
        color: $store.state.theme === 'chalk' ? '#fff' : '#333',
      }"
    ></h5>
  </div>
</template>

<script>
import { ProvinceInfo } from '@/core/province_info.js';

export default {
  data () {
    return {
      chartInstance: null, // echart实例
      data: null, // 请求的数据
      api: new this.$api(),
      province_info: new ProvinceInfo(),
      provinceMapCache: {},
      currentMapText: '',
      titleFontSize: 0
    }
  },

  created () {
    this.$socket.registerCallBack('mapChange', this.changeMap);
  },

  async mounted () {
    this.initChart();
    await this.getData();
    // 自适应窗口大小
    this.screenAdapter(); // 立即执行一次
    window.addEventListener('resize', this.screenAdapter);
  },

  watch: {
    '$store.state.theme': function () {
      this.currentMapText = '';
      this.chartInstance.dispose(); // 销毁当前图表
      this.initChart(); // 重新初始化图表
      this.updateChart();
      this.screenAdapter();
    }
  },

  destroyed () {
    window.removeEventListener('resize', this.screenAdapter); // 注销事件，防止内存泄漏
    this.$socket.unRegisterCallBack('mapChange');
  },

  methods: {
    // 初始化chart，需要获取DOM元素，所以在mounted之后调用
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.mapRef, this.$store.state.theme);
      this.$showLoading(this.chartInstance);
      // 获取中国地图矢量数据  并配置
      this.$echarts.registerMap('china', await this.$http.get(this.api.china));
      // 初始化option配置
      const initOption = {
        title: {
          text: '▍商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          // roam: true,
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical', // 图例垂直摆放
        }
      };
      this.chartInstance.setOption(initOption);
      this.$hideLoading(this.chartInstance);
      this.chartInstance.on('click', e => {
        // 点击切换到省地图
        if (e.name !== '南海诸岛') {
          const province_pinyin = Reflect.get(this.province_info, e.name);
          if (province_pinyin) {
            this.$socket.send({
              action: 'mapChange',
              socketType: 'mapChange',
              value: province_pinyin,
              mapName: e.name,
            });
          }
        }
      });
    },

    // 请求数据
    async getData () {
      this.$showLoading(this.chartInstance);
      this.data = await this.$http.get(this.api.map);
      this.$hideLoading(this.chartInstance);
      this.updateChart();
    },

    // 更新视图
    updateChart () {
      const seriesArr = this.data.map(item => {
        return {
          rippleEffect: {
            brushType: 'stroke', // 涟漪动画空心
            scale: 5
          },
          coordinateSystem: 'geo', // 地图坐标
          type: 'effectScatter', // 涟漪动画
          name: item.name,
          data: item.children
        }
      });
      const legendArr = this.data.map(item => item.name);
      const dataOption = {
        series: seriesArr,
        legend: {
          data: legendArr
        }
      };
      this.chartInstance.setOption(dataOption);
    },

    // resize监听事件 配置分辨率
    screenAdapter () {
      const width = this.$refs.mapRef.offsetWidth;
      this.titleFontSize = width / 100 * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize, // 图例间隔
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },

    // 双击图标回到中国地图
    resetChinaMap () {
      this.$socket.send({
        action: 'mapChange',
        socketType: 'mapChange',
        value: 'china',
        mapName: '',
      });
    },

    async changeMap (map, mapName) {
      this.currentMapText = mapName;
      if (map === 'china') {
        this.chartInstance.setOption({
          geo: {
            map: 'china',
          },
        });
        return;
      }
      if (!Reflect.get(this.provinceMapCache, map)) {
        // 如果缓存标记中没有该省份，则请求服务器数据
        this.$showLoading(this.chartInstance);
        const province_api = Reflect.get(this.api, map);
        const province_map = await this.$http.get(province_api);
        this.$echarts.registerMap(map, province_map); // 注册省份地图
        Reflect.set(this.provinceMapCache, map, true); // 标记已有的地图
        this.$hideLoading(this.chartInstance);
      }
      this.chartInstance.setOption({
        geo: {
          map: map,
        },
      });
    }
  }
}
</script>

<style lang="less" scoped>
.com-container {
  .current-map {
    position: absolute;
    bottom: 5%;
    right: 5%;
  }
}
</style>