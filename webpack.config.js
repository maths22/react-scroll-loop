'use strict';

const env = process.env.NODE_ENV || 'development';

const webpack = require('webpack');
const path = require('path');
const webpackUMDExternal = require('webpack-umd-external');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pluginsList = [];
const outputFileName = env === 'production' ? 'react-scroll-loop.min.js' : 'react-scroll-loop.js';

if (env === 'production') {
  pluginsList.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false }
    })
  );
  pluginsList.push(
    new CopyWebpackPlugin([
      {
        from: './src/reactSwipe.js',
        to: './reactSwipe.js'
      },
      {
        from: './src/swipe.js',
        to: './swipe.js'
      }
    ])
  );
}

const config = {
  entry: path.join(__dirname, 'src/reactSwipe.js'),

  output: {
    path: path.join(__dirname, 'dist'),
    filename: outputFileName,
    library: 'ReactSwipe',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  externals: webpackUMDExternal({
    'react': 'React',
    'swipe-js-iso': 'Swipe'
  }),

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  plugins: pluginsList,

  module: {
    // preLoaders: [{
    //   test: /\.jsx?$/,
    //   loaders: ['eslint'],
    //   exclude: /node_modules/
    // }],

    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ['babel']
    }, {
      test: /\.css$/,
      exclude: /(node_modules)/,
      loader: 'style!css'
    }]
  }
};

module.exports = config;