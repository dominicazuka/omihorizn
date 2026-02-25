const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './index.web.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@react-native/babel-preset'],
            ],
          },
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    // WEB-FIRST resolution: exclude .native files completely
    extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      'react-native': 'react-native-web',
    },
    mainFields: ['browser', 'module', 'main'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      favicon: './assets/favicon.svg',
    }),
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    host: 'localhost',
    static: {
      directory: path.join(__dirname, '.'),
      watch: false,
    },
    watchFiles: {
      paths: ['src/**/*.{js,jsx,ts,tsx}', 'index.web.js', 'index.html', 'index.css', 'src/**/*.css'],
      options: {
        ignored: ['**/node_modules/**', '**/.expo/**', '**/dist/**', '**/.git/**', '**/app/**'],
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
};
