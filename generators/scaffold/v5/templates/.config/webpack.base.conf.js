var path = require('path');
var config = require('./build-config/');
var utils = require('./utils');
var projectRoot = path.resolve(__dirname, '../');

var env = process.env.NODE_ENV;
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap);
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap);
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd;


var fs = require("fs");


var publicPath = getPublichPath();

function getPublichPath() {

    if (process.env.NODE_ENV === "production") {
        return config.build.assetsPublicPath;
    } else if (process.env.NODE_ENV === "production-test") {
        return config.buildtest.assetsPublicPath;
    } else {
        return config.dev.assetsPublicPath;
    }

}


var baseConfig = {
    entry: {
        app: './js/index.js'
    },
    output: {
        path: config.build.assetsRoot,
        publicPath: publicPath,
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', ''],
        fallback: [path.join(__dirname, '../node_modules')],
        alias: {}
    },
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    // vue: {
    //     loaders: utils.cssLoaders({sourceMap: useCssSourceMap}),
    //     postcss: [
    //         require('autoprefixer')({
    //             browsers: ['last 2 versions']
    //         })
    //     ]
    // },
    static: {}
}
if (config.buildConfig.jscompile === "babeljs") {
    baseConfig.module.loaders.push({
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/
    })


}


module.exports = baseConfig;
