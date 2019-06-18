// Libraries
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const multi = require('multi-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
require('babel-polyfill');

// const viewsFolder = path.resolve(__dirname, '../src/views/pages');

// Files
const utils = require('./utils');
const plugins = require('../postcss.config');
// Configuration
module.exports = (env) => {
  const devMode = env.NODE_ENV === 'development';
  const config = {
    context: path.resolve(__dirname, '../src'),
    // mode: 'development',  // Uncomment for unminify html
    entry: {
      app: [
        'babel-polyfill',
        './assets/styles/_app.scss',
        './app.js',
      ],
      app_JP: [
        'babel-polyfill',
        './assets/styles/_app-JP.scss',
        './app_JP.js',
      ],
      app_PT: [
        'babel-polyfill',
        './assets/styles/_app-PT.scss',
        './app_PT.js',
      ],
      app_VI: [
        'babel-polyfill',
        './assets/styles/_app-VI.scss',
        './app.js',
      ],
      app_TH: [
        'babel-polyfill',
        './assets/styles/_app-TH.scss',
        './app.js',
      ],
      app_CN: [
        'babel-polyfill',
        './assets/styles/_app-CN.scss',
        './app.js',
      ],
      app_Off: [
        'babel-polyfill',
        './assets/styles/_app-Off.scss',
        './app_Offline.js',
      ],
      app_Off_JP: [
        'babel-polyfill',
        './assets/styles/_app-Off-JP.scss',
        './app_Offline.js',
      ],
      app_Off_PT: [
        'babel-polyfill',
        './assets/styles/_app-Off-PT.scss',
        './app_Offline.js',
      ],
      app_Off_VI: [
        'babel-polyfill',
        './assets/styles/_app-Off-VI.scss',
        './app_Offline.js',
      ],
      app_Off_CN: [
        'babel-polyfill',
        './assets/styles/_app-Off-CN.scss',
        './app_Offline.js',
      ],
      app_Off_TH: [
        'babel-polyfill',
        './assets/styles/_app-Off-TH.scss',
        './app_Offline.js',
      ],
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      // publicPath: '/',
      filename: 'assets/js/[name].bundle.js',
    },
    devServer: {
      contentBase: path.resolve(__dirname, '../src'),
      // hot: true,
    },
    resolve: {
      extensions: ['.js', '.css', '.scss'],
      alias: {
        source: path.resolve(__dirname, '../src'), // Relative path of src
        images: path.resolve(__dirname, '../src/assets/images'), // Relative path of images
      },
    },
    /*
          Loaders with their configurations
        */
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['env'],
                plugins: ['syntax-dynamic-import'],
              },
            },
          ],
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'font-family-unescape-loader',
            'css-loader',
            'postcss-loader?sourceMap',
            'sass-loader?sourceMap',
          ],
        },
        {
          test: /\.pug$/,
          use: [
            {
              loader: 'pug-loader',
            },
          ],
        },
        {
          test: /\.(gif|svg|ico)$/,
          use: [
            {
              loader: 'image-webpack-loader',
            },
            {
              loader: 'url-loader',
              options: {
                limit: 3000,
                name: 'assets/images/[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|png)$/i,
          loader: multi(
            'file-loader?name=assets/images/[name].[ext].webp!webp-loader?{quality: 100}',
            'file-loader?name=assets/images/[name].[ext]',
          ),
        },
        {
          test: /\.(woff2?|woff|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 5000,
            name: 'assets/fonts/[name].[ext]',
          },
        },
        {
          test: /\.(json)(\?.*)?$/,
          exclude: [/node_modules/],
          loader: 'url-loader',
          options: {
            name: 'assets/[name].[ext]',
          },
        },
        {
          test: /\.(mp4)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'assets/videos/[name].[ext]',
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(['dist'], {
        root: path.join(__dirname, '..'),
      }),
      new CopyWebpackPlugin([
        {
          from: 'assets/images/',
          to: 'assets/images/[name].[ext]',
        },
      ]),
      new MiniCssExtractPlugin({
        filename: '[name].bundle.css',
        allChunks: true,
      }),
      /*
      Pages
    */

      // // Desktop page
      new HtmlWebpackPlugin({
        locale: 'en_EN',
        filename: 'index.html',
        template: 'views/index.pug',
        chunks: ['app', 'index'],
        chunksSortMode: (a, b) => (a.names[0] === 'index' ? 1 : 0),
      }),
      new HtmlWebpackPlugin({
        locale: 'pt_PT',
        filename: 'index_PT.html',
        template: 'views/index.pug',
        chunks: ['app_PT', 'index'],
        chunksSortMode: (a, b) => (a.names[0] === 'index' ? 1 : 0),
      }),
      new HtmlWebpackPlugin({
        locale: 'jp_JP',
        filename: 'index_JP.html',
        template: 'views/index.pug',
        chunks: ['app_JP', 'index'],
        chunksSortMode: (a, b) => (a.names[0] === 'index' ? 1 : 0),
      }),
      new HtmlWebpackPlugin({
        locale: 'vi_VI',
        filename: 'index_VI.html',
        template: 'views/index.pug',
        chunks: ['app_VI', 'index'],
        chunksSortMode: (a, b) => (a.names[0] === 'index' ? 1 : 0),
      }),
      new HtmlWebpackPlugin({
        locale: 'th_TH',
        filename: 'index_TH.html',
        template: 'views/index.pug',
        chunks: ['app_TH', 'index'],
        chunksSortMode: (a, b) => (a.names[0] === 'index' ? 1 : 0),
      }),
      new HtmlWebpackPlugin({
        locale: 'cn_CN',
        filename: 'index_CN.html',
        template: 'views/index.pug',
        chunks: ['app_CN', 'index'],
        chunksSortMode: (a, b) => (a.names[0] === 'index' ? 1 : 0),
      }),
      new HtmlWebpackPlugin({
        locale: 'en_EN',
        filename: 'index_Off.html',
        template: 'views/index.pug',
        chunks: ['app_Off', 'index'],
        chunksSortMode: (a, b) => (a.names[0] === 'index' ? 1 : 0),
      }),
      new HtmlWebpackPlugin({
        locale: 'jp_JP',
        filename: 'index_Off_JP.html',
        template: 'views/index.pug',
        chunks: ['app_Off_JP', 'index'],
        chunksSortMode: (a, b) => (a.names[0] === 'index' ? 1 : 0),
      }),
      new HtmlWebpackPlugin({
        locale: 'pt_PT',
        filename: 'index_Off_PT.html',
        template: 'views/index.pug',
        chunks: ['app_Off_PT', 'index'],
        chunksSortMode: (a, b) => (a.names[0] === 'index' ? 1 : 0),
      }),
      new HtmlWebpackPlugin({
        locale: 'vi_VI',
        filename: 'index_Off_VI.html',
        template: 'views/index.pug',
        chunks: ['app_Off_VI', 'index'],
        chunksSortMode: (a, b) => (a.names[0] === 'index' ? 1 : 0),
      }),
      new HtmlWebpackPlugin({
        locale: 'cn_CN',
        filename: 'index_Off_CN.html',
        template: 'views/index.pug',
        chunks: ['app_Off_CN', 'index'],
        chunksSortMode: (a, b) => (a.names[0] === 'index' ? 1 : 0),
      }),
      new HtmlWebpackPlugin({
        locale: 'th_TH',
        filename: 'index_Off_TH.html',
        template: 'views/index.pug',
        chunks: ['app_Off_TH', 'index'],
        chunksSortMode: (a, b) => (a.names[0] === 'index' ? 1 : 0),
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.$': 'jquery',
        'window.jQuery': 'jquery',
        MicroModal: 'micromodal',
      }),
      new WebpackNotifierPlugin({
        title: 'Village House',
      }),
    ],
  };

  config.plugins.push(
    ...utils.pages(env),
  );
  
  if (!devMode) {
    config.plugins.push(
      new MinifyPlugin(),
    );
  }
  return config;
};
