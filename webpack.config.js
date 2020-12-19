const webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (env) => {
  // Use env.<YOUR VARIABLE> here

  return {
    mode: env.MODE,
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    target: 'node',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new CleanWebpackPlugin(),
      // Adds the executable indicator to the top of the output file
      new webpack.BannerPlugin({
        raw: true,
        banner: '#!/usr/bin/env node',
      }),
    ],
  }
}
