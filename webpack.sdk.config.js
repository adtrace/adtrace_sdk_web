const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const FlowWebpackPlugin = require('flowtype-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
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
    new ESLintPlugin(),
    new webpack.DefinePlugin({
      __ADTRACE__NAMESPACE: JSON.stringify(namespace),
      __ADTRACE__SDK_VERSION: JSON.stringify(version)
    }),
    new FlowWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [{
      use: 'babel-loader',
      test: /\.(js|ts)$/,
      exclude: /node_modules/
    }, {
      test: /\.module\.s?css$/,
      use: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: 'adtrace-smart-banner__[hash:base64]',
            }
          },
        },
        { loader: 'sass-loader' }
      ]
    }]
  }
})
