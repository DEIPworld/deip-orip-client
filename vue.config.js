const path = require('path');

module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .test(/^((?!webfont).)*\.svg(\?.*)?$/)
      .use('inline-svgo-loader')
      .loader(require.resolve('inline-svgo-loader'));

    config.module
      .rule('svgFont')
      .test(/^(.*(?=webfont).*)\.svg(\?.*)?$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'))
      .tap(() => ({
        name: 'fonts/[name].[hash:8].[ext]'
      }));
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

  runtimeCompiler: true,

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
};
