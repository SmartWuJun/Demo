// 假设我们上述那个例子的代码是 ./plugins/index 这个文件
const FileListPlugin = require('./plugin/index.js')

module.exports={
  mode:'development',
  entry:{
   app:'./src/index.js',
    search:'./src/search.js'
  },
  output:{
    filename:'[name].js',
    path:__dirname+'/dist'
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        use:'babel-loader'
      },
      {
        test:/\.txt$/,
        use:'raw-loader'
      }
    ]
  },
  plugins: [
    new FileListPlugin(), // 实例化这个插件，有的时候需要传入对应的配置
  ]
}