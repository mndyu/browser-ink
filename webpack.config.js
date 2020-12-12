const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',

  entry: {
    content: './src/app/content.ts',
    background: './src/app/background.ts',
    options: './src/ui/options.ts',
    popup: './src/ui/popup.tsx'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {loader: 'ts-loader'},
          {
            loader: '@linaria/webpack-loader',
            options: {
              sourceMap: process.env.NODE_ENV !== 'production'
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/popup.css'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/options.html'),
      filename: 'options.html',
      chunks: ['options'],
      inject: true,
      minify: {}
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/popup.html'),
      filename: 'popup.html',
      chunks: ['popup'],
      inject: true,
      minify: {}
    }),
    new CompressionPlugin({
      test: /\.js$|\.css$|\.html$/
    })
  ]
}
