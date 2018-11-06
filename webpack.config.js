const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, './', dir);
}

module.exports = {
  entry:  {
    index: resolve("src/js/index.js"),
    home: resolve("src/js/home.js"),
    help: resolve("src/js/help.js"),
  },
  /*配置模块如何解析*/
  resolve: {
    extensions: ['.js'],
    alias: {
      'common': resolve('src/common'),
      'util': resolve('src/util'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: [
          resolve('src')
        ],
        loader: 'babel-loader',
      },
      /*{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
        test: /\.less$/i,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'less-loader')
      },*/

      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader'],
          publicPath: '../'
        })
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader'],
          publicPath: '../'
        })
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {
        test:/\.(png|jpg|jpeg|gif)$/,
        use:[
          {
            loader:'url-loader',
            options:{
              name:'[name]-[hash:5].[ext]',
              limit: 1000,
              outputPath:'dist/images/' // html和css中图片的输出路径
            }
          }]
      },
      // {
      //   loader:'html-loader',
      //   options:{
      //     attrs:['img:src','img:data-src']
      //   }
      // },
      // expose-loader 用来把模块（CMD/AMD/UMD）暴露到全局变量，在使用时必须显示 require，例如 require('jquery')
      // {
      //   test: require.resolve('jquery'),
      //   use: [
      //     {
      //       loader: 'expose-loader',
      //       options: 'jQuery',
      //     }, {
      //       loader: 'expose-loader',
      //       options: '$',
      //     }
      // ]},
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
    ],
  },
//已多次提及的唯一入口文件
  devtool: 'eval-source-map',
  output: {
    path: resolve('dist'),
    filename: "js/[name].js",
    chunkFilename:'js/[chunkhash:8].chunk.js',
    // publicPath: resolve('dist/'),
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    port: 8083,
    inline: true, //实时刷新
    hot: true,
  },
  plugins: [
    // 全局依赖jQuery, jquery文件必须支持AMD或者CMD的模块规范，才能够使用ProvidePlugin
    // ProvidePlugin主要用来省略模块（只对AMD和CMD模块有效）依赖导入写法
    new webpack.ProvidePlugin({
      _ : 'lodash',
      $ : "jquery",
      jQuery:"jquery",
      "window.jQuery": "jquery"
    }),

    // 定义全局变量
    new webpack.DefinePlugin({
      'process.env': 'dev',
      __DEV__: true,
    }),
    // 开启HMR的时候，更细木块是，显示对应的模块名称
    new webpack.NamedModulesPlugin(),

    // 开启全局HMR
    new webpack.HotModuleReplacementPlugin(),

    // webpack打包错误时，跳过错误
    new webpack.NoEmitOnErrorsPlugin(),

    // 提取第三方库和公共模块
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor', // 已经存在chunk
      /*
      * minChunks:
      * 数字 - 指某个模块最少被多少个入口文件依赖，才被认为是一个公共模块，该模块就会被打包到公用包中，否则该模块就会被和每个入口文件打包在一起
      * Infinity - 表示不会把任何依赖的模块提取出来打包公用
      * */
      minChunks(module) {
        return (
          module.resource && /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        );
      },
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),


    new ExtractTextPlugin("css/[name].css"),

    new HtmlWebpackPlugin({
      title: '你好',
      filename: `pages/index.html`,
      template: `./src/pages/index.html`,
      inject: true,
      chunks: [`index`, 'vendor', 'manifest'],
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true
      // }
    }),

    new HtmlWebpackPlugin({
      filename: `pages/home.html`,
      template: `./src/pages/home.html`,
      inject: true,
      chunks: [`home`, 'vendor', 'manifest'],
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true
      // }
    }),

    new HtmlWebpackPlugin({
      filename: `pages/help.html`,
      template: `./src/pages/help.html`,
      inject: true,
      chunks: [`help`, 'vendor', 'manifest'],
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true
      // }
    }),
  ],
}