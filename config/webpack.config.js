const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
    entry: {
        main: './src/index.js',
        common: './src/Common/index.js',
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
        ],
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            inject: 'body',
            filename: 'index.html',
            favicon: './public/favicon.ico'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CopyPlugin([
            { from: 'public/assets', to: 'assets' }
        ]),
        // This is causing issues - wav and jpg and png get encoding errors 
        // new CompressionPlugin({
        //     exclude: /\.(mp4|webm)$/,
        //     filename: '[path]'
        // })
    ],
    output: {
        publicPath: '/'
    },
    devServer: {
        hot: true,
        inline: true,
        contentBase: ['./src', './public'],
        historyApiFallback: true,
        open: true,
        port: 3000,
        watchOptions: {
            poll: true
        }
    },
};