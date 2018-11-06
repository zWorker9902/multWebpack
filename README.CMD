webpack:

css-loader: 加载.css文件
style-loader:使用<style>将css-loader内部样式注入到我们的HTML页面

1、source-map的作用：
    由于打包之后的文件，是通过解析（Es6转Es5）和压缩的，所以在调试上不是很容易定位错误，所以需要使用source-map为我们提供一种对应编译文件和源文件的方法，是的
    编译后的代码可读性高，也更容易调试；

    devtool：
       source-map
                在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的source map，但是它会减慢打包速度；
       cheap-module-source-map
                在一个单独的文件中生成一个不带列映射的map，不带列映射提高了打包速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号），会对调试造成不便；
       eval-source-map
                使用eval打包源文件模块，在同一个文件中生成干净的完整的source map。这个选项可以在不影响构建速度的前提下生成完整的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项，在生产阶段则一定不要启用这个选项；
       cheap-module-eval-source-map
                这是在打包文件时最快的生成source map的方法，生成的Source Map 会和打包后的JavaScript文件同行显示，没有列映射，和eval-source-map选项具有相似的缺点；


    注：
        对小到中型的项目中，eval-source-map是一个很好的选项，再次强调你只应该开发阶段使用它
        cheap-module-eval-source-map方法构建速度更快，但是不利于调试，推荐在大型项目考虑时间成本时使用。

2、webpack可能需要全局引入一些库：例如JQuery，Lodash，可以有两种方式：
    1）使用 webpack.ProvidePlugin 在全局引入：
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        });
    2）使用 expose-loader，
    npm install --save expose-loader

    {
       test: require.resolve('jquery'),
       use: [{
          loader: 'expose-loader',
          options: 'jQuery'
       },{
          loader: 'expose-loader',
          options: '$'
       }]
    }

    使用：require('jquery')


    因为该项目用ES6，所以需要babel转换

    　　安装babel：npm install babel-preset-es2015 --save-dev

    　　配置.babelrc文件：{"presets": ["es2015"]}

    　　到目前为止，在命令行输入：npm run build，就可以正常打开本地的index.html文件了

    3、webpack-dev-middleware与webpack-hot-middleware用于本地开发

    webpack-dev-middleware是对更改的文件进行监控，编译,重新打包，但是该插件不会将文件打包到真是硬盘上，
    而是打包到内存中，通过webpack.config.js获取到webpack文件，随后将其打包到内存中

     webpack-hot-middleware为一中间层插件，用于热加载更新网页，需基于webpack-dev-middleware

     安装 webpack, webpack-dev-middleware, style-loader, css-loader

     首先这两个插件组合起来是可以实现页面的热刷新工作， 而做到这一点，首先要对更改的文件进行监控，编译，而这个webpack-dev-middleware就是干这个的，专业点叫做伺服器，而webpack-hot-middleware 是用来进行页面的热重载的。而且这些文件资源并不会出现在真实的路径里，而是保存在内存中，如果文件改变，这个伺服器就不在去请求旧的文件，而是延迟请求直到新的文件编译完成。


     可以用用express库和webpack-dev-middleware组合的本地服务器，他们的组合的功能和webpack-dev-server功能一样，一般用它们组合起来更轻便灵巧。


4、多页面开发，dev（开发环境不提取css，以便在使用时可以试试刷新样式）

5、前后端分离后的接口调用跨域处理方式
情景：
前后端分离，本地前端开发调用接口会有跨域问题，一般有以下3种解决方法：
1）. 后端接口打包到本地运行（缺点：每次后端更新都要去测试服下一个更新包，还要在本地搭建java运行环境，麻烦）
2）. CORS跨域：后端接口在返回的时候，在header中加入'Access-Control-Allow-origin':* 之类的（有的时候后端不方便这样处理，前端就蛋疼了）
3）. 用nodejs搭建本地http服务器，并且判断访问接口URL时进行转发，完美解决本地开发时候的跨域问题。




