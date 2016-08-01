var webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV || 'development';
const debug = NODE_ENV !== 'production' && NODE_ENV !== 'staging';

module.exports = {
  context: __dirname + "/client",
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./index.jsx",
  resolve: {
    modulesDirectories: ['node_modules', 'components'],
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + "/client/",
    filename: "client.min.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', "es2015"]
        }
      }
    ]
  },
  plugins: debug ? [] : [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(NODE_ENV)
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
};
