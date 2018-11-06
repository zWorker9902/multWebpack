const opn = require('opn'); // 返回生成的子进程的promise
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.dev.conf');

const express = require('express');

console.info('设置server启动配置');
const port = 8083;

const app = express();

console.info('编译webpack配置');
const compiler = webpack(webpackConfig);
console.info('webpack编译完成');

console.info('将编译流通过webpack-dev-middleware');
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  /*
  * 建立中间件服务路径,通常是和 webpackConfig.output.publicPath 相同
  * */
  publicPath: webpackConfig.output.publicPath,

  /*两种模式：
1、监测模式（默认）：文件改变时编译器就重新编译。
2、惰性模式：编译器编译每个请求的入口点。  */
  lazy: false,
  // 输出选项，表示输出哪些内容
  stats: {
    chunks: false,
    chunkModules: false,
    colors: true,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
});

// webpack-hot-middleware 用来进行页面的热重载的,刷新浏览器，一般和 webpack-dev-middleware 配合使用，实现热加载功能
// webpack-hot-middleware 和 webpack-dev-middleware来实现像 webpack-dev-server 一样的热加载功能。
console.info('将编译流通过webpack-hot-middleware');
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {},
  heartbeat: 2000,
});

console.info('监听HTML文件改变事件')
compiler.plugin('compilation', function (compilation) {
  //webpack编译完成
  //在这个插件合成出页面之后，添加一个回调，调用中间件emit一个action为
  // reload的事件，对应另一边client订阅的事件，实现浏览器的刷新
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({action: 'reload'})
    cb()
  })
});

console.info('设置静态文件托管目录');
/*
*  通过静态文件托管，就可以访问对应目录下的图片，css，JavaScript文件
* 例如：
*   在/dist/public目录下有 images／1。jpg
* 访问：
*   http://localhost:3000/images/1.jpg
* */
app.use('/dist', express.static('public'));

console.info('设置代理信息');
require('./dev-proxy')(app);

// console.info('添加history-fallback中间件');
// app.use(require('connect-history-api-fallback')());

console.info('添加webpack-dev-middleware中间件');
app.use(devMiddleware);

console.info('添加webpack-hot-middleware中间件');
app.use(hotMiddleware);

const uri = `http://localhost:${port}`;

console.info('> Starting dev server...');
console.info('设置webpack-dev-middleware中间件编译后的回调');

devMiddleware.waitUntilValid(() => {
  console.info(`> Listening at ${uri}\n`);
  opn(uri);
});

console.info(`server开始监听端口${port}`);
const server = app.listen(port);
