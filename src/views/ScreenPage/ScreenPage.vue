<template>
  <div
    class="screenpage screen-container"
    :style="{
      backgroundColor: $store.state.theme === 'chalk' ? '#161522' : '#efefef',
    }"
  >
    <header class="screen-header">
      <div>
        <img
          :src="
            $store.state.theme === 'chalk'
              ? '/static/img/header_border_dark.png'
              : '/static/img/header_border_light.png'
          "
        />
      </div>
      <div class="title-left" @click="theme_click">
        <span
          class="title-text"
          style="margin: 0 10px"
          :style="{ color: $store.state.theme === 'chalk' ? '#fff' : '#333' }"
          >切换主题</span
        >
        <img
          :src="
            $store.state.theme === 'chalk'
              ? '/static/img/qiehuan_dark.png'
              : '/static/img/qiehuan_light.png'
          "
          class="qiehuan"
        />
      </div>
      <h1
        class="title"
        :style="{ color: $store.state.theme === 'chalk' ? '#fff' : '#333' }"
      >
        电商平台实时监控系统
      </h1>
      <div class="title-right">
        <span
          class="title-text"
          style="margin: 0 10px"
          v-text="timeText"
          :style="{ color: $store.state.theme === 'chalk' ? '#fff' : '#333' }"
        ></span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="{ fullscreen: fullScreenStatus.trend }">
          <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
          <div
            :class="{
              resize: true,
              shrink: fullScreenStatus.trend,
              enlarge: !fullScreenStatus.trend,
              color_black: $store.state.theme === 'vintage',
            }"
            @click="enlarge_click('trend')"
          ></div>
        </div>
        <div id="left-bottom" :class="{ fullscreen: fullScreenStatus.seller }">
          <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
          <div
            :class="{
              resize: true,
              shrink: fullScreenStatus.seller,
              enlarge: !fullScreenStatus.seller,
              color_black: $store.state.theme === 'vintage',
            }"
            @click="enlarge_click('seller')"
          ></div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="{ fullscreen: fullScreenStatus.map }">
          <!-- 商家分布图表 -->
          <China-Map ref="map"></China-Map>
          <div
            :class="{
              resize: true,
              shrink: fullScreenStatus.map,
              enlarge: !fullScreenStatus.map,
              color_black: $store.state.theme === 'vintage',
            }"
            @click="enlarge_click('map')"
          ></div>
        </div>
        <div id="middle-bottom" :class="{ fullscreen: fullScreenStatus.rank }">
          <!-- 地区销量排行图表 -->
          <Rank ref="rank"></Rank>
          <div
            :class="{
              resize: true,
              shrink: fullScreenStatus.rank,
              enlarge: !fullScreenStatus.rank,
              color_black: $store.state.theme === 'vintage',
            }"
            @click="enlarge_click('rank')"
          ></div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="{ fullscreen: fullScreenStatus.hot }">
          <!-- 热销商品占比图表 -->
          <Hot ref="hot"></Hot>
          <div
            :class="{
              resize: true,
              shrink: fullScreenStatus.hot,
              enlarge: !fullScreenStatus.hot,
              color_black: $store.state.theme === 'vintage',
            }"
            @click="enlarge_click('hot')"
          ></div>
        </div>
        <div id="right-bottom" :class="{ fullscreen: fullScreenStatus.stock }">
          <!-- 库存销量分析图表 -->
          <Stock ref="stock"></Stock>
          <div
            :class="{
              resize: true,
              shrink: fullScreenStatus.stock,
              enlarge: !fullScreenStatus.stock,
              color_black: $store.state.theme === 'vintage',
            }"
            @click="enlarge_click('stock')"
          ></div>
        </div>
      </section>
    </div>
  </div>
</template>

<script src="./ScreenPage.js"></script>

<style src="./ScreenPage.less" lang="less" scoped></style>