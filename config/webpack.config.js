const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const path = require('path');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var ejs = require('ejs');
var fs = require('fs');

var template = ejs.compile(fs.readFileSync(__dirname + '/template.ejs', 'utf-8'))

module.exports = {
    entry: './src/index.js',
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
            { from: 'public/assets', to: 'assets'}
        ]),
        new StaticSiteGeneratorPlugin({
            paths: ['/', '/1'],
            locals: {
                template: template
            },
            globals: new JSDOM(``, {url: 'http://localhost/'}).window 
        })
        // This is causing issues - wav and jpg and png aget encoding errors 
        // new CompressionPlugin({
        //     exclude: /\.(mp4|webm)$/,
        //     filename: '[path]'
        // })
    ],
    output: {
        publicPath: '/',
        filename: 'index.js',
        path: path.join(__dirname, '..', 'dist'),
        /* IMPORTANT!
        * You must compile to UMD or CommonJS
        * so it can be required in a Node context: */
        libraryTarget: 'commonjs'
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
    }
};