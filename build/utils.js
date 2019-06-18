/* eslint-disable func-names */
exports.pages = function (entry) {
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const fs = require('fs');
  const path = require('path');
  const viewsFolder = path.resolve(__dirname, '../src/views/pages');

  const pages = [];
  fs.readdirSync(viewsFolder).forEach((view) => {
    const viewName = view.split('.')[0];

    const options = {
      filename: `${viewName}/index.html`,
      template: `views/pages/${view}`,
      inject: true,
      chunks: ['app', 'index'],
    };
    // const options_CN = {
    //   filename: `${viewName}/index_CN.html`,
    //   template: `views/pages/${view}`,
    //   inject: true,
    //   chunks: ['app_CN', 'index'],
    // };
    // const options_TH = {
    //   filename: `${viewName}/index_TH.html`,
    //   template: `views/pages/${view}`,
    //   inject: true,
    //   chunks: ['app_TH', 'index'],
    // };

    pages.push(new HtmlWebpackPlugin(options));
    // pages.push(new HtmlWebpackPlugin(options_CN));
    // pages.push(new HtmlWebpackPlugin(options_TH));
  });

  return pages;
};
