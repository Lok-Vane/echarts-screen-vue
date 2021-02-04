/**
 * 请求结果拦截
 */
export default [
    response => response.data,
    error => {
        return Promise.reject({
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
        });
    }
];