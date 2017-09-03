/* webpack --config  webpack.dll.config.js --progress */

const path = require('path');
const webpack = require('webpack');
const lib = [
  'ansi-html',
  'babel-polyfill',
  'error-stack-parser',
  'events',
  'fbjs',
  'html-entities',
  'history',
  'immutable',
  'lodash',
  'object-assign',
  'prop-types',
  'querystring',
  'react',
  'react-dom',
  'react-router',
  'react-redux',
  'react-router-redux',
  'react-helmet',
  'react-proxy',
  'react-transform-hmr',
  'react-transform-catch-errors',
  'react-deep-force-update',
  'react-transition-group',
  'react-side-effect',
  'redux',
  'redux-async-connect',
  'redbox-react',
  'sourcemapped-stacktrace',
  'stackframe',
  'superagent',
  'whatwg-fetch',
];
const isDebug = process.env.NODE_ENV === 'development';

const outputPath = isDebug ? path.join(__dirname, '/debug') : path.join(__dirname, '/build');
console.log('-----------------------');
console.log(outputPath);
console.log('-----------------------');


const plugin = [
  new webpack.DllPlugin({
    /**
     * path  定义 manifest 文件生成的位置 [name]的部分由entry的名字替换
     */
    path: path.join(outputPath, 'manifest.json'),
    /**
     * name  dll bundle 输出到那个全局变量上  和 output.library 一样即可。
     */
    name: '[name]',
    context: __dirname
  }),
  new webpack.optimize.OccurenceOrderPlugin()
];

if (!isDebug) {
  plugin.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify("production")
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: { except: ['$', 'exports', 'require'] },
      exclude: /\.min\.js$/,
      // mangle:true,
      compress: { warnings: false },
      output: { comments: false }
    })
  );
}

module.exports = {
  devtool: 'source-map',
  entry: { lib: lib },
  output: {
    path: outputPath,
    filename: '[name].js',
    /**
     * output.library
     * 将会定义为 window.${output.library}
     * 在这次的例子中，将会定义为`window.vendor_library`
     */
    library: '[name]'
  },
  plugins: plugin
};
