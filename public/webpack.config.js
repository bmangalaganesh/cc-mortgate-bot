var path = require('path');

module.exports = {
  entry: [
    path.resolve(__dirname, './js/global.js'),
  ],
  output: {
    path: __dirname,
    filename: './js/app.bundle.js',
    libraryTarget: 'var',
    library: 'Global',
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'resolve-url', 'sass'],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      }
    ],
    // sassLoader: {
    //   includePaths: [path.resolve(__dirname, '../../node_modules/bootstrap-sass/assets/stylesheets')],
    // },
  },
};
