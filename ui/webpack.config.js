var path = require('path');
var webpack = require('webpack');
var LiveReloadPlugin = require('webpack-livereload-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = env => ({
    mode: 'development', //env && env.production ? 'production' : 'development',
    entry: {
        app: './src/app.js',
        iconpicker: './src/plugins/iconpicker/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'webpack'),
    },
    plugins: [
        new LiveReloadPlugin(),
        //new BundleAnalyzerPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
});
