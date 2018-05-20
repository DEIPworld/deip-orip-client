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

import './components/core/index';
import './components/research/index';
import './components/user/index';

import config from './config'
import deipRpc from '@deip/deip-rpc';

Vue.use(Vuetify, {
    theme: {
        'primary': '#2F80ED'
    }
})
Vue.component('v-gravatar', Gravatar);

Vue.config.productionTip = false
deipRpc.api.setOptions({ url: config['deip-full-node-url'] });
deipRpc.config.set('chain_id', config['chain-id']);

Vue.prototype.DEIP_100_PERCENT = 10000;
Vue.prototype.DEIP_1_PERCENT = 10000 / 100;
Vue.prototype.convertToPercent = amount => amount * 100 / 10000;
Vue.prototype.toDeipPercent = amount => amount * 100;


/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
})