const { defineConfig } = require('@vue/cli-service')
const registerRouter = require('./backend/router.js')

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和mixin
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  },
  devServer: {
    onBeforeSetupMiddleware(app) {
      registerRouter(app.app)
    }
  }
})
