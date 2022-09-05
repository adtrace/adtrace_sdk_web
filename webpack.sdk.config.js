const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const FlowWebpackPlugin = require('flow-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const packageJson = require('./package.json')
const namespace = 'adtrace-sdk'
const version = packageJson.version

module.exports = () => ({
  mode: 'production',
  entry: {
    'adtrace-latest': path.resolve(__dirname, 'src/sdk/main.js'),
    'adtrace-latest.min': path.resolve(__dirname, 'src/sdk/main.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'Adtrace',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      include: /\.min\.js$/
    })]
  },
  plugins: [
    new webpack.DefinePlugin({
      __Adtrace__NAMESPACE: JSON.stringify(namespace),
      __Adtrace__SDK_VERSION: JSON.stringify(version)
    }),
    new FlowWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [{
      use: 'eslint-loader',
      test: /\.(js|ts)$/,
      enforce: 'pre',
      exclude: /node_modules/
    }, {
      use: 'babel-loader',
      test: /\.(js|ts)$/,
      exclude: /node_modules/
    }]
  }
})
