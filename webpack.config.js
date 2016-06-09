var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        main: ['whatwg-fetch', './web/main.js']
    },
    output: {
        path: path.resolve(__dirname, './public/js'),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    plugins: [
        new webpack.ProvidePlugin({
            riot: 'riot'
        })
    ],
    resolve: {
        extensions: ['', '.js'],
        root: __dirname,
        alias: {
            // riot: '../node_modules/riot/riot.min.js',
        }
    },
    module: {
        // preLoaders: [
        //     {
        //         test: /\.html$/,
        //         exclude: /node_modules/,
        //         loader: 'riotjs-loader',
        //         query: { type: 'none' }
        //     }
        // ],
        loaders: [
            {
                test: /\.js$/,
                include: /web/,
                loader: 'babel',
                query: {
                    plugins: ['transform-runtime']
                }
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.html?$/,
                loader: 'tag-loader',
                exclude: /(node_modules|bower_components)/,
                query: {
                    type: 'babel'
                }
            }
        ]
    },
    devServer: {
        contentBase: './', //html root
        hot: true
    }
    // historyApiFallback: true,
};