import { Configuration } from 'webpack';
import * as Path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import 'webpack-dev-server';

const config: Configuration = {
  mode: 'development',
  entry: Path.resolve(__dirname, 'src/browser.tsx'),
  output: {
    path: Path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts','.tsx','.js'],
    modules: ['node_modules']
  },
  module: {
    rules: [
      {test: /\.tsx?$/, loader: 'ts-loader'}
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Crypto Demo',
      hash: true,
      template: Path.resolve(__dirname, 'src/tpl.html')
    })
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true
  }
};

export default config;
