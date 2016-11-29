// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
var fs = require("fs");
var buildConfig = require("../../package.json").buildConfig;


module.exports = {
    buildConfig: buildConfig,
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'), //入口文件
        assetsRoot: path.resolve(__dirname,'../../','../dist'), //文件打包位置
        assetsSubDirectory: 'static', //静态资源文件夹
        assetsPublicPath: "/", //发布的项目资源路径
        productionSourceMap: false //是否要生成sourceMap
    },
    dev: {
        env: require('./dev.env'),
        port: 8080,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {},
        cssSourceMap: false
    }
}
