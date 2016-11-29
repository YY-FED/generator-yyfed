var path = require('path');
var config = require('./build-config/');
var utils = require('./utils');
var webpack = require('webpack');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var resolve = path.resolve;
var env = config.build.env;

var version = config.build.version;

// var InsertPlugin = require("./insert-hijack-plugin");

var loaders = utils.styleLoaders({sourceMap: config.build.productionSourceMap, extract: true});

baseWebpackConfig.module.loaders.push({
    test: /\.jpe?g|\.png|\.gif$/,
    loader: "img-loader",
    query: {
        minimize: true,
        optimizationLevel: 5,
        progressive: true
    }
});

var webpackConfig = merge(baseWebpackConfig, {
    module: {
        loaders: loaders
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].js'),
        chunkFilename: utils.assetsPath('js/[id].js')
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': env
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        // extract css into its own file
        new ExtractTextPlugin(utils.assetsPath('css/[name].css')),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            static: baseWebpackConfig.static,
            filename: path.resolve(config.build.assetsRoot, './index.html'),
            template: './index.ejs',
            inject: true,
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),

        // 切割依赖文件
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                //所有需要在node_modules 加载的都会被导出到这个文件中
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        })


    ]
});


module.exports = webpackConfig;
