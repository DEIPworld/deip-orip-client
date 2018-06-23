// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import Vuetify from 'vuetify'
import Gravatar from 'vue-gravatar';
import 'vuetify/dist/vuetify.css'
import './styles/common.less'
import 'vue2-dropzone/dist/vue2Dropzone.css'

import './components/layout/index';
import './components/core/index';
import './components/common/index';
import './components/user-details/index';
import './components/research-feed/index'
import './components/research-create/index';
import './components/research-details/index';
import './components/research-content-details/index';
import './components/research-group-details/index';
import './components/research-group-create/index';
import './components/token-sale-create/index';
import './components/user-wallet/index';

import config from './config'
import deipRpc from '@deip/deip-rpc';
import moment from 'moment';

Vue.use(Vuetify, {
    theme: {
        'primary': '#2F80ED'
    }
})
Vue.component('v-gravatar', Gravatar);
import './components/common/filters/index';

Vue.config.productionTip = false
deipRpc.api.setOptions({ url: config['deip-full-node-url'] });
deipRpc.config.set('chain_id', config['chain-id']);

Vue.prototype.percentQuantityRegex = /^(?:0|(?:[1-9]\d*))(?:\.\d{1,2})?$/;
Vue.prototype.DEIP_100_PERCENT = 10000;
Vue.prototype.DEIP_1_PERCENT = 10000 / 100;
Vue.prototype.convertToPercent = amount => parseInt(amount) * 100 / 10000;
Vue.prototype.toDeipPercent = amount => parseInt(amount) * 100;
Vue.prototype.fileStorageBaseUrl = config['deip-server-url']


Vue.prototype.assetQuantityRegex = /^(?:0|(?:[1-9]\d*))(?:\.\d{1,3})?$/;
Vue.prototype.toAssetUnits = amount => {
    let value = parseFloat(amount).toFixed(3);
    return `${value} ${config['asset-unit']}`;
};
Vue.prototype.fromAssetsToFloat = assets => parseFloat(assets.split(' ')[0]);

Vue.filter('dateFormat', (value, format) => {
    return moment(value).format(format);
});


/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
})