import Vue from 'vue';

import VueResize from 'vue-resize';
import VueCurrencyFilter from 'vue-currency-filter';
import VueGoogleCharts from 'vue-google-charts';
import PortalVue from 'portal-vue';
import lsWatcher from 'vue-storage-watcher';

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

import { getEnvConfig } from '@/plugins/getEnvConfig';
import { vuetify } from '@/plugins/vuetify';
import { ifEnabled } from '@/plugins/ifEnabled';

import { dataReadyMixin } from '@/mixins/dataReadyMixin';
import { contextHelpersMixin } from '@/mixins/contextHelpersMixin';
import { CustomDirective } from '@/derectives/CustomDirective';

// ////////////////////////

Vue.config.productionTip = false;
Vue.use(VueGoogleCharts);
Vue.use(VueResize);
Vue.use(PortalVue);

Vue.use(VueCurrencyFilter, {
  symbol: '$',
  thousandsSeparator: ',',
  fractionCount: 2,
  fractionSeparator: '.',
  symbolPosition: 'front',
  symbolSpacing: true
});

Vue.use(lsWatcher, {
  prefix: 'orip__'
});

Vue.use(DSnackbarPlugin);
Vue.use(ifEnabled);

Vue.mixin(dataReadyMixin);
Vue.mixin(contextHelpersMixin);
Vue.directive('custom', CustomDirective);

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
