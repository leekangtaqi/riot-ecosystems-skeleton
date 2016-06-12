var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        main: ['whatwg-fetch', './web/main.js']
        // main: ['whatwg-fetch', 'babel-polyfill', './web/main.js']
    },
    output: {
        path: path.resolve(__dirname, './public/js'),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        }),
        new webpack.ProvidePlugin({
            riot: 'riot'
        })
    ],
    resolve: {
        extensions: ['', '.js'],
        root: __dirname,
        alias: {
            'riot-form': '../node_modules/riot-form-mixin/lib/validator',
        }
    },
    module: {
        preLoaders: [
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'riotjs-loader',
                query: { type: 'babel' }
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                include: /web/,
                loader: 'babel'
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            }
        ]
    },
    node: {
        net: 'mock',
        dns: 'mock',
        fs: 'empty'
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './', //html root
        hot: true
    }
};