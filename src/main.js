import Vue from 'vue';

/**
 * BOOTSTRAP
 */

import VueResize from 'vue-resize';
import VueCurrencyFilter from 'vue-currency-filter';
import VueGoogleCharts from 'vue-google-charts';
import { setConfig, setDeipRpc, setTheme, setUser, setTenant } from './bootstrap';

/**
 * APP
 */

import App from './App';
import { store } from './store';
import { router } from './router';

import './components/index'; // TODO: need refactoring and remove
import './globals/index'; // TODO: need refactoring and remove


/**
 * PLUGINS
 */


/**
 * STYLES
 */

import 'vuetify/dist/vuetify.css';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import '@mdi/font/css/materialdesignicons.css';
import 'vue-resize/dist/vue-resize.css';
import './styles/common.less';

// ////////////////////////

const currencyFilterOptions = {
  symbol: '$',
  thousandsSeparator: ',',
  fractionCount: 2,
  fractionSeparator: '.',
  symbolPosition: 'front',
  symbolSpacing: true,
};

Vue.config.productionTip = false;
Vue.use(VueGoogleCharts);
Vue.use(VueResize);
Vue.use(VueCurrencyFilter, currencyFilterOptions);

(async () => {
  try {
    await setConfig(); // Set global application config config

    await setDeipRpc();
    await setTheme();
    await setUser();
    await setTenant();

    new Vue({
      store,
      router,
      render: (h) => h(App),
    }).$mount('#app');
  } catch (err) {
    console.error(err);
  }
})();

export const bus = new Vue();
