import Vue from 'vue';

import VueResize from 'vue-resize';
import VueCurrencyFilter from 'vue-currency-filter';
import VueGoogleCharts from 'vue-google-charts';
import PortalVue from 'portal-vue';

import App from './App';
import { store } from './store';
import { router } from './router';

import './components/index'; // TODO: need refactoring and remove
import './globals/index'; // TODO: need refactoring and remove

import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import '@mdi/font/css/materialdesignicons.css';
import 'vue-resize/dist/vue-resize.css';
import './styles/common.less';

import './styles/app.scss';

import { DSnackbarPlugin } from '@/components/Deipify/DSnackbar/DSnackbarPlugin';

import { vuetify } from '@/plugins/vuetify';
import { deipAddons } from '@/plugins/deipAddons';
import { getEnvConfig } from '@/plugins/getEnvConfig';

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
Vue.use(PortalVue);
Vue.use(VueCurrencyFilter, currencyFilterOptions);

Vue.use(DSnackbarPlugin);
Vue.use(deipAddons);

getEnvConfig().then((plugin) => {
  Vue.use(plugin);

  new Vue({
    store,
    router,
    vuetify,
    render: (h) => h(App)
  }).$mount('#app');
});

export const bus = new Vue();
