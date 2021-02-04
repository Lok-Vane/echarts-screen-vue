import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import echarts from 'echarts';
import axios from 'axios';
import reqInterceptor from '@/interceptors/request.interceptor.js';
import resInterceptor from '@/interceptors/response.interceptor.js';
import { ApiSetting } from '@/core/api_setting.js';
import { showLoading, hideLoading } from '@/core/echarts_loading.js'; // echarts加载蒙层
import '@/assets/css/global-style.less'; // 引入全局样式
import 'public/static/theme/chalk.js'; // Echarts主题_chalk
import 'public/static/theme/vintage.js'; // Echarts主题_vintage
import WebSocketService from '@/core/web_socket_service.js';

// axios.defaults.baseURL = 'http://127.0.0.1:3000';

Vue.config.productionTip = false;

Vue.prototype.$echarts = echarts;
Vue.prototype.$showLoading = showLoading;
Vue.prototype.$hideLoading = hideLoading;

Vue.prototype.$api = ApiSetting;
Vue.prototype.$http = axios;
axios.interceptors.request.use(...reqInterceptor);
axios.interceptors.response.use(...resInterceptor);

Vue.prototype.$socket = WebSocketService.Instance;
Vue.prototype.$socket.connect();

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');