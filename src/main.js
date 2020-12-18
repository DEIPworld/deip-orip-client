import Vue from 'vue';

import VueResize from 'vue-resize';
import Clipboard from 'v-clipboard';
import VueCurrencyFilter from 'vue-currency-filter';
import VueGoogleCharts from 'vue-google-charts';
import PortalVue from 'portal-vue';
import lsWatcher from 'vue-storage-watcher';
// import VueCommonFilters from 'vue-common-filters'

import './components/index'; // TODO: need refactoring and remove
import './globals/index'; // TODO: need refactoring and remove
import VClamp from 'vue-clamp/Clamp';
import VueTheMask from 'vue-the-mask';

import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import '@mdi/font/css/materialdesignicons.css';
import 'v-credit-card/dist/VCreditCard.css';
import 'vue-resize/dist/vue-resize.css';
import './styles/common.less';

import './styles/app.scss';

import { DSnackbarPlugin } from '@/components/Deipify/DSnackbar/DSnackbarPlugin';

import { getEnvConfig } from '@/plugins/getEnvConfig';
import { vuetify } from '@/plugins/vuetify';
import { ifEnabled } from '@/plugins/ifEnabled';
import { filterWhere } from '@/plugins/filterWhere';

import VuetifyExtended from '@/plugins/VuetifyExtended';

import { dataReadyMixin } from '@/mixins/dataReadyMixin';
import { contextHelpersMixin } from '@/mixins/contextHelpersMixin';
import { CustomDirective } from '@/derectives/CustomDirective';
import Gravatar from 'vue-gravatar';
import { i18n } from './plugins/i18n';
import { router } from './router';
import { store } from './store';
import App from './App';


// ////////////////////////

import veeValidatorPlugin from '@/plugins/veeValidator';

// ////////////////////////

import AssetsFeature from '@/features/Assets';
import AuthFeature from '@/features/Auth';
import FundraisingFeature from '@/features/Fundraising';
// import ContentsFeature from '@/features/Contents'; // conflict
import ProjectsFeature from '@/features/Projects';
import ReferencesFeature from '@/features/References';
import ReviewsFeature from '@/features/Reviews';
import UsersFeature from '@/features/Users';
import NotificationsFeature from '@/features/Notifications';
import BookmarksFeature from '@/features/Bookmarks';
import TeamsFeature from '@/features/Teams';

// ////////////////////////

Vue.config.productionTip = false;

Vue.use(VueGoogleCharts);
Vue.use(VueResize);
Vue.use(Clipboard);
Vue.use(PortalVue);
Vue.use(VueTheMask);
// Vue.use(VueCommonFilters);

Vue.use(VuetifyExtended, { vuetify });
Vue.use(veeValidatorPlugin);

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

Vue.component('v-clamp', VClamp);

// ////////////////////////

Vue.use(DSnackbarPlugin);
Vue.use(ifEnabled);
Vue.use(filterWhere);

Vue.mixin(dataReadyMixin);
Vue.mixin(contextHelpersMixin);

Vue.directive('custom', CustomDirective);

// Featyures // NOTE: Try new feature logic

Vue.use(AuthFeature);
Vue.use(AssetsFeature);
Vue.use(TeamsFeature);

Vue.use(ProjectsFeature);
// Vue.use(ContentsFeature); // conflict
Vue.use(FundraisingFeature);
Vue.use(ReferencesFeature);
Vue.use(ReviewsFeature);
Vue.use(UsersFeature);
Vue.use(NotificationsFeature);
Vue.use(BookmarksFeature);

// ////////////////////////////////////////

Vue.config.optionMergeStrategies.props = (parentVal, childVal) => {
  if (childVal) {
    for (const k of Object.keys(childVal)) {
      if (childVal[k].delete) {
        // eslint-disable-next-line no-param-reassign
        delete childVal[k];
        // eslint-disable-next-line no-param-reassign
        delete parentVal[k];
      }
    }
  }
  return { ...(parentVal || {}), ...(childVal || {}) };
};

getEnvConfig().then((plugin) => {
  Vue.use(plugin);

  new Vue({
    store,
    router,
    vuetify,
    i18n,
    render: (h) => h(App)
  }).$mount('#app');
});

export const bus = new Vue();
