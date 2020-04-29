const path = require('path');

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: (loaderContext) => {
          const { resourcePath, rootContext } = loaderContext;
          const relativeArray = path.relative(rootContext, resourcePath).split('/');

          if (relativeArray[0] === 'node_modules' && relativeArray[1] === 'vuetify') {
            return '@import "~@/scss/next/core/_vuetify-settings.scss"';
          }

          return '';
        }
      }
    }
  },

  devServer: {
    setup(app) {
      app.get('/env', (req, res) => {
        res.json(require(path.join(__dirname, 'config', 'env.js')));
      });
    }
  },

  productionSourceMap: false,

  // lintOnSave: process.env.NODE_ENV !== 'production'
  lintOnSave: false,

  assetsDir: 'assets',

  transpileDependencies: ['@deip/*'],

  runtimeCompiler: true
};
