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
import { isLoggedIn } from "./utils/auth";

Vue.use(Vuetify, {
  theme: {
    primary: "#2962FF",
    secondary: "#BBDEFB"
  },
  options: {
    customProperties: true
  }
});

Vue.config.productionTip = false;

async function initApp() {
  try {
    const env = await axios.get('/env');
    window.env = env.data;
    deipRpc.api.setOptions({ url: window.env.DEIP_FULL_NODE_URL });
    deipRpc.config.set('chain_id', window.env.CHAIN_ID);
    if (!window.env.TENANT) window.env.TENANT = "";
    console.log(window.env);

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