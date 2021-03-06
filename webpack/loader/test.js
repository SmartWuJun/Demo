

// loader-utils作为工具类引入(作为webpack依赖，所以在安装webpack时候就带上了)
const loaderUtils = require('loader-utils')

module.exports=function(source,inputSourceMap){
  const code = source
  const map = inputSourceMap
  console.log('map: ', map);
  // loaderUtils.getOptions 可以获取到设置loader时候设置的options
  // 当然loaderUtils还有很多其他有用的方法，详情可以看 https://github.com/webpack/loader-utils
  const loaderOptions = loaderUtils.getOptions(this) || {};
  console.log(source)
  console.log(loaderOptions)
  // loader需要将自己的值传给下一个loader，并且，loader不免会有异步操作
  // 因此需要回调来证明自己已经处理结束了
  this.callback(null, code, map)

}