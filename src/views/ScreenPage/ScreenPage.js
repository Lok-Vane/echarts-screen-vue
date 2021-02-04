export default {
    name: 'screenpage',
    props: {

    },
    components: {
        'Hot': () =>
            import ('@/components/Hot.vue'), // 组件懒加载
        'China-Map': () =>
            import ('@/components/Map.vue'),
        'Rank': () =>
            import ('@/components/Rank.vue'),
        'Seller': () =>
            import ('@/components/Seller.vue'),
        'Stock': () =>
            import ('@/components/Stock.vue'),
        'Trend': () =>
            import ('@/components/Trend.vue'),
    },
    data() {
        return {
            timer: null,
            timeText: '加载中...',
            fullScreenStatus: {
                trend: false,
                seller: false,
                map: false,
                rank: false,
                hot: false,
                stock: false,
            }
        }
    },
    methods: {
        enlarge_click(chartName) {
            const value = !Reflect.get(this.fullScreenStatus, chartName);
            this.$socket.send({
                action: 'fullScreen',
                socketType: 'fullScreen',
                chartName,
                value,
            });
        },
        recvData(chartName, value) {
            Reflect.set(this.fullScreenStatus, chartName, value);
            this.$nextTick(() => {
                Reflect.get(this.$refs, chartName).screenAdapter();
            });
        },
        theme_click() {
            const currentTheme = this.$store.state.theme;
            const value = currentTheme === 'chalk' ? 'vintage' : 'chalk';
            this.$socket.send({
                action: 'themeChange',
                socketType: 'themeChange',
                value,
            });
        },
        changeTheme(theme) {
            if (theme === this.$store.state.theme) return;
            this.$store.commit('changeTheme');
        }
    },
    created() {
        this.$socket.registerCallBack('fullScreen', this.recvData);
        this.$socket.registerCallBack('themeChange', this.changeTheme);
        // 右上角时间
        {
            this.timer = null;
            const time = () => {
                clearTimeout(this.timer);
                const date = new Date();
                const tips = `当前时间：`;
                const temp = `${date.getFullYear()}-
                  ${(date.getMonth() + 1).toString().padStart(2, '0')}-
                  ${(date.getDate()).toString().padStart(2, '0')}`;
                this.timeText = `${tips}${temp}
                  ${(date.getHours()).toString().padStart(2, '0')}:
                  ${(date.getMinutes()).toString().padStart(2, '0')}:
                  ${(date.getSeconds()).toString().padStart(2, '0')}`;
                this.timer = setTimeout(time, 1000);
            }
            this.timer = setTimeout(time, 1000);
        }
    },
    destroyed() {
        this.$socket.unRegisterCallBack('fullScreen');
        this.$socket.unRegisterCallBack('themeChange');
        clearTimeout(this.timer);
    }
}