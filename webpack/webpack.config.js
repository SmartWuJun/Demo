// 假设我们上述那个例子的代码是 ./plugins/index 这个文件
const FileListPlugin = require('./plugin/index.js')
const HelloWorldPlugin = require('./plugin/helloworld')


const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// console.log('CleanWebpackPlugin: ', CleanWebpackPlugin);



const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          {
            loader: path.resolve('loader/unit-loader.js'),
            options: {
              speak: 'hello world'
            }
          }],

      },
      {
        test: /\.txt$/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new FileListPlugin(), // 实例化这个插件，有的时候需要传入对应的配置
    new HelloWorldPlugin({
      paths: ["./configuration/config.js"]
    }),
    // 清理dist
    new CleanWebpackPlugin(),
    // 将js打入html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve('index.html'),
      chunks: ['app'] // 因为只有一个页面，这行不写也可以
    })
  ]
}