class HelloWorldPlugin {
  constructor(options) {
    this.options=options;
  }
  apply (compiler) {
    let paths=this.options.paths;
    compiler.plugin('done', function() {
      console.log('Hello World!'); 
    });
  }
}

module.exports=HelloWorldPlugin