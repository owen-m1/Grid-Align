let webpack = require('webpack');
let path = require('path');
let debug = true;

module.exports = {
    context: __dirname,
    devtool: debug ? 'inline-source-map' : false,
    entry: {
        index: ['babel-polyfill', './index.js']
    },
    output: {
        path: __dirname,
        filename: '[name].min.js'
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    }
};