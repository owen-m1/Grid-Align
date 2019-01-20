let webpack = require('webpack');
let path = require('path');
let debug = true;

module.exports = {
    context: path.join(__dirname, 'src'),
    devtool: debug ? 'inline-source-map' : false,
    entry: {
        gridAlign: ['./gridAlign.js']
    },
    output: {
        libraryTarget: 'umd',
        library: 'GridAlign',
        path: path.join(__dirname, 'dist'),
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