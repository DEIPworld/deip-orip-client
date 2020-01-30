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
import { isLoggedIn, setAccessToken } from "./utils/auth";
import VueGoogleCharts from 'vue-google-charts';
import VueCurrencyFilter from 'vue-currency-filter';
import VueResize from 'vue-resize';
import themes from './theme.json';
import crypto from '@deip/lib-crypto';
import authService from './services/http/auth';

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

    await setGlobalThemeSettings();
    await setUser();
    await setTenant();

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

async function setGlobalThemeSettings() {
  const tenant = window.env.TENANT || null;

  const themeSettings = tenant && themes[tenant]
    ? themes[tenant]
    : themes['default'];

  if (tenant) {
    if (tenant == "nsf") {
      document.title = "MyNSF | DEIP";
    } else if (tenant == "mit") {
      document.title = "MIT | DEIP";
    } else if (tenant == "treasury") {
      document.title = "U.S. Treasury | DEIP";
    }
  }

  document.title = "Civic Platform";

  Vue.use(Vuetify, {
    theme: {
      primary: themeSettings['primary-color'],
      secondary: themeSettings['secondary-color']
    },
    options: {
      customProperties: true
    }
  });

  await store.dispatch("layout/setGlobalThemeSettings", themeSettings);
}

async function setUser() {
  if (isLoggedIn()) {
    await store.dispatch("auth/loadUser");
  } else if (window.env.FORCE_LOGIN) {
    const [username, privateKey] = window.env.FORCE_LOGIN.split(",");
    const secretKey = crypto.PrivateKey.from(privateKey);
    const secretSig = secretKey.sign(new TextEncoder("utf-8").encode(window.env.SIG_SEED).buffer);
    const secretSigHex = crypto.hexify(secretSig);
    authService.signIn({ username: username, secretSigHex: secretSigHex })
      .then((response) => {
        setAccessToken(response.jwtToken, privateKey);
        window.location.replace(`${window.location.href}`);
      })
  }
}

async function setTenant() {
  const tenant = window.env.TENANT || null;
  if (tenant) {
    await store.dispatch("auth/loadTenant", { tenant });
  }
}

initApp();