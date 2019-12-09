// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import deipRpc from '@deip/deip-oa-rpc-client';

import App from './App';
import store from './store';
import router from './router';
import './index';
import './globals/index';
import 'vuetify/dist/vuetify.css';
import './styles/common.less';
import 'vue2-dropzone/dist/vue2Dropzone.css';
import '@mdi/font/css/materialdesignicons.css';
import 'vue-resize/dist/vue-resize.css';
import { isLoggedIn } from "./utils/auth";
import VueGoogleCharts from 'vue-google-charts';
import VueCurrencyFilter from 'vue-currency-filter';
import VueResize from 'vue-resize';

Vue.config.productionTip = false;

Vue.use(VueGoogleCharts);
Vue.use(VueResize);
Vue.use(VueCurrencyFilter, {
  symbol: '$',
  thousandsSeparator: ',',
  fractionCount: 3,
  fractionSeparator: '.',
  symbolPosition: 'front',
  symbolSpacing: true
});

async function initApp() {
  try {
    const env = await axios.get('/env');
    window.env = env.data;
    deipRpc.api.setOptions({ url: window.env.DEIP_FULL_NODE_URL, reconnectTimeout: 3000 });
    deipRpc.config.set('chain_id', window.env.CHAIN_ID);
    if (!window.env.TENANT) window.env.TENANT = "";

    window.env.THEME = theme[window.env.TENANT]
      ? theme[window.env.TENANT]
      : theme['default'];

    if (document && window.env.TENANT) {
      if (window.env.TENANT == "nsf") {
        document.title = "MyNSF - DEIP Grants Transparency";
      } else if (window.env.TENANT == "mit") {
        document.title = "MIT - DEIP Grants Transparency";
      } else if (window.env.TENANT == "treasury") {
        document.title = "U.S. Treasury - DEIP Grants Transparency";
      }
    }

    Vue.use(Vuetify, {
      theme: {
        primary: window.env.THEME['primary-color'],
        secondary: window.env.THEME['secondary-color']
      },
      options: {
        customProperties: true
      }
    });

    if (isLoggedIn()) {
      await store.dispatch("auth/loadUser");
    }

    window.app = new Vue({
      el: '#app',
      store,
      router,
      components: { App },
      template: '<App/>'
    });
  } catch (err) {
    console.error(err)
  }
}

initApp();