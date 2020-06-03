const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});
module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'public'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|svg|eot|otf|ttf|woff|woff2)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 20000,
                            name: '[name]-[hash].[ext]'
                        }
                    }
                ]
            },
            {
            test: /\.(js|jsx)$/,
            use: { 
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    presets: [
                        "@babel/env",
                        "@babel/react"
                    ],
                    plugins: [
                        "@babel/plugin-transform-runtime",
                        "@babel/proposal-class-properties",
                        "@babel/plugin-proposal-export-default-from",
                        ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }] // `style: true` for less
                    ]
                }
            },
            exclude: /node_modules/
        },
        {
            test: /\.s?css$/,
            use: [
              'style-loader',
              'css-loader',
              'sass-loader'
            ]
        }
    ]
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        watchOptions: {
            poll: true
        },
        contentBase: path.resolve(__dirname, 'public'),
        historyApiFallback: true
    },
    performance: {
        hints: false
    },
    plugins: [
        htmlPlugin
    ]
};