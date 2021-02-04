import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [{
        path: '/sellerpage',
        name: 'sellerpage',
        component: () =>
            import ('@/views/SellerPage.vue') // 路由懒加载
    },
    {
        path: '/seller',
        redirect: '/sellerpage'
    },
    {
        path: '/trendpage',
        name: 'trendpage',
        component: () =>
            import ('@/views/TrendPage.vue')
    },
    {
        path: '/trend',
        redirect: '/trendpage'
    },
    {
        path: '/mappage',
        name: 'mappage',
        component: () =>
            import ('@/views/MapPage.vue')
    },
    {
        path: '/map',
        redirect: '/mappage'
    },
    {
        path: '/rankpage',
        name: 'rankpage',
        component: () =>
            import ('@/views/RankPage.vue')
    },
    {
        path: '/rank',
        redirect: '/rankpage'
    },
    {
        path: '/hotpage',
        name: 'hotpage',
        component: () =>
            import ('@/views/HotPage.vue')
    },
    {
        path: '/hot',
        redirect: '/hotpage'
    },
    {
        path: '/stockpage',
        name: 'stockpage',
        component: () =>
            import ('@/views/StockPage.vue')
    },
    {
        path: '/stock',
        redirect: '/stockpage'
    },
    {
        path: '/screenpage',
        name: 'screenpage',
        component: () =>
            import ('@/views/ScreenPage/ScreenPage.vue')
    },
    {
        path: '*',
        redirect: '/screenpage'
    }
];

const router = new VueRouter({
    routes
});

export default router;