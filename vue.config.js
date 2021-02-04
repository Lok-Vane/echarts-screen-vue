const path = require("path");

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    chainWebpack: config => {
        config.resolve.alias
            .set("public", resolve("public"))
            .set("#", resolve("src"))
            .set("assets", resolve("src/assets"))
            .set("core", resolve("src/core"))
            .set("components", resolve("src/components"))
    },
    devServer: {
        /**
         * 端口也可以在package.json中配置
         * "serve": "vue-cli-service serve --open --port 8008",
         */
        port: 8008,
        open: true,
        proxy: {
            '/data': {
                target: 'http://127.0.0.1:3000',
                changeOrigin: true,
                // pathRewrite: {
                //     '^/api': ''
                // }
            }
        }
    }
}

// 每次修改配置之后必须重新启动项目