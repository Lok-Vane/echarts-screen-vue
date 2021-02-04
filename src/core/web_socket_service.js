export default class WebSocketService {
    /**
     * 单例设计模式
     */
    static instance = null;
    static get Instance() {
        if (!this.instance) {
            this.instance = new WebSocketService();
        }
        return this.instance;
    }

    ws = null;
    url = 'ws://127.0.0.1:3001';
    token = '4dgfNt%t7YN8nY9M9^%564';
    connected = false; // 是否连接成功
    sendRetryCount = 0; // 发送数据重试次数
    connectRetryCount = 0; // 连接服务器重试次数
    callBackMap = {}; // 存储回调函数

    connect() {
        if (!window.WebSocket) {
            return alert('您的浏览器不支持 WebSoket ！');
        }
        this.ws = new WebSocket(`${this.url}?token=${this.token}`);

        this.ws.addEventListener('open', (e) => {
            console.warn('websocket已连接');
            this.connectRetryCount = 0;
            this.connected = true;
        });
        this.ws.addEventListener('message', (msg) => {
            const data = JSON.parse(msg.data);
            const socketType = data.socketType;

            const cb = Reflect.get(this.callBackMap, socketType);
            if (cb) {
                switch (data.action) {
                    case 'getData':
                        Reflect.apply(cb, this, [data.data]);
                        break;
                    case 'fullScreen':
                        Reflect.apply(cb, this, [data.chartName, data.value]);
                        break;
                    case 'themeChange':
                        Reflect.apply(cb, this, [data.value]);
                        break;
                    case 'mapChange':
                        Reflect.apply(cb, this, [data.value, data.mapName]);
                        break;
                    default:
                        break;
                }
            }
        });
        this.ws.addEventListener('error', (e) => {
            // console.log('连接错误', e);
        });
        // 断开重连机制
        // 连接不成功、连接断开时执行
        this.ws.addEventListener('close', (e) => {
            this.connected = false;
            // console.log('连接关闭', e);
            this.connectRetryCount++;
            console.warn(`WebSocket已断开，${500 * this.connectRetryCount}ms后尝试重连`);
            setTimeout(() => {
                this.connect();
            }, 500 * this.connectRetryCount);
        });
    }

    close() {
        this.connected = false;
        this.ws.close();
    }

    // 数据重发机制
    send(data) {
        // 检测连接状态
        if (this.connected) {
            this.sendRetryCount = 0; // 发送成功，重置次数为0
            this.ws.send(JSON.stringify(data));
            return;
        }
        this.sendRetryCount++;
        setTimeout(() => {
            this.send(data);
        }, 500 * this.sendRetryCount);
    }

    // 注册回调函数
    registerCallBack(socketType, cb) {
        Reflect.set(this.callBackMap, socketType, cb);
    }

    // 注销回调函数
    unRegisterCallBack(socketType) {
        Reflect.set(this.callBackMap, socketType, undefined);
    }
}