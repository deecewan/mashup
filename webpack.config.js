import webpack from 'webpack';
import path from 'path';
import Dash from 'webpack-dashboard/plugin'; // eslint-disable-line

export default {
  entry: [
    'babel-polyfill',
    'webpack-hot-middleware/client',
    './client/index.jsx',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false,
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint?{fix:true}'],
        exclude: /(node_modules|bower_components|dist)/,
      },
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: [
            'es2015',
            'es2016',
            'stage-0',
            'react-hmre',
          ],
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new Dash(),
  ],
};
