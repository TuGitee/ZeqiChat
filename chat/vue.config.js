const { defineConfig } = require('@vue/cli-service')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  devServer: {
    proxy: {

    },
  },
  configureWebpack: config=>{
    config.plugins.push(new CompressionPlugin({
      test: /\.js$|\.html$|\.css/, // 匹配文件名
      threshold: 10240, // 对超过10k的数据进行压缩
      deleteOriginalAssets: false // 是否删除原文件
    }))
  }
})
