const path = require('path');
const webpack = require('webpack');
const env = process.env.NODE_ENV || 'development';
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    // mode: 'development',
    mode: env,
    entry: './src/asset/js/app.js',
    output: {
        filename: 'bundle.js',
        // 出力先のパス（絶対パスを指定する）
        path: path.join(__dirname, './dist/js'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                // ローダーの処理対象から外すディレクトリ
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader'],
            },
            {
                // enforce: 'pre'を指定することによって
                // enforce: 'pre'がついていないローダーより早く処理が実行される
                // 今回はbabel-loaderで変換する前にコードを検証したいため、指定が必要
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
        ],
    },
};
