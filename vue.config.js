const path = require('path');

module.exports = {
  css: {
    loaderOptions: {
      // sass: {
      //   prependData: () => {
      //     return ''
      //   }
      // }
    }
  },
  chainWebpack: config => {
    // ['vue-modules', 'vue', 'normal-modules', 'normal'].forEach(match => {
    //   config.module
    //     .rule('sass')
    //     .oneOf(match)
    //     .use('sass-loader')
    //     .tap(opt => {
    //       return {
    //         ...opt,
    //         ...{
    //           prependData: ({ resourcePath }) => (
    //             resourcePath.includes('vuetify') && resourcePath.includes('node_modules')
    //               ? '@import "~@/styles/next/core/_vuetify-settings.scss"'
    //               : ''
    //           )
    //         }
    //       };
    //     });
    // });
  },
  devServer: {
    setup(app) {
      app.get('/env', (req, res) => {
        res.json(require(path.join(__dirname, 'config', 'env.js')));
      });
    }
  },
  productionSourceMap: false,
  lintOnSave: false,
  assetsDir: 'assets',
  transpileDependencies: [
    '@deip/*',
    'vuetify'
  ],
  runtimeCompiler: true
};
