const webpack = require('webpack')
const path = require('path')

module.exports = {
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
    // Adds the executable indicator to the top of the output file
    new webpack.BannerPlugin({
      raw: true,
      banner: '#!/usr/bin/env node',
    }),
  ],
}
