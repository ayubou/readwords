const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'docs',
  publicPath: '/prdct/readwords',
  css:{
    loaderOptions:{
      scss:{
        additionalData:`@import "@/assets/sass/main.scss";`
      }
    }
  }
})
