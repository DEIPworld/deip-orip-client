// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import Gravatar from 'vue-gravatar';
import 'vuetify/dist/vuetify.css'
import './styles/common.less'
import 'vue2-dropzone/dist/vue2Dropzone.css'

import './components/core/index';
import './components/research/index';
import './components/user/index';

import './../deip-rpc/dist/deip.min';

import config from './config'

Vue.use(Vuetify, {
    theme: {
        'primary': '#2F80ED'
    }
})
Vue.component('v-gravatar', Gravatar);

Vue.config.productionTip = false
deipRpc.api.setOptions({ url: config['deip-full-node-url'] });
deipRpc.config.set('chain_id', config['chain_id']);

Vue.prototype.DEIP_100_PERCENT = 10000;
Vue.prototype.DEIP_1_PERCENT = 10000 / 100;
Vue.prototype.convertToPercent = function(amount) { return amount * 100 / 10000 };


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})