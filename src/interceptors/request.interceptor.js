/**
 * 此处统一设置请求头
 */
export default [
    config => {
        config.withCredentials = true; // 允许携带token,这个是解决跨域产生的相关问题
        config.timeout = 6000;
        // console.log(config);
        // let token = sessionStorage.getItem('access_token');
        // if (token) {
        //     config.headers = {
        //         'access-token': token,
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     }
        // }
        // if (config.url === 'refresh') {
        //     config.headers = {
        //         'refresh-token': sessionStorage.getItem('refresh_token'),
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     }
        // }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
];