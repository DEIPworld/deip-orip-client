import Vue from 'vue';

import VueResize from 'vue-resize';
import VueCurrencyFilter from 'vue-currency-filter';
import VueGoogleCharts from 'vue-google-charts';
import Vuetify from 'vuetify';

import {
  setConfig,
  setDeipRpc,
  setTheme,
  setUser,
  setTenant
} from './bootstrap';

import App from './App.vue';
import { store } from './store';
import { router } from './router';

import './components/index'; // TODO: need refactoring and remove
import './globals/index'; // TODO: need refactoring and remove

import 'vuetify/dist/vuetify.css';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import '@mdi/font/css/materialdesignicons.css';
import 'vue-resize/dist/vue-resize.css';
import './styles/common.less';

import './styles/app.scss';

// ////////////////////////

const currencyFilterOptions = {
  symbol: '$',
  thousandsSeparator: ',',
  fractionCount: 2,
  fractionSeparator: '.',
  symbolPosition: 'front',
  symbolSpacing: true
};

Vue.config.productionTip = false;
Vue.use(VueGoogleCharts);
Vue.use(VueResize);
Vue.use(Vuetify);
Vue.use(VueCurrencyFilter, currencyFilterOptions);

(async () => {
  try {
    await setConfig(); // Set global application config config

    await setDeipRpc();
    await setUser();
    await setTenant();

    const themeSettings = await setTheme();

    new Vue({
      store,
      router,
      vuetify: new Vuetify({ ...themeSettings }),
      render: (h) => h(App)
    }).$mount('#app');
  } catch (err) {
    console.error(err);
  }
})();

export const bus = new Vue();
