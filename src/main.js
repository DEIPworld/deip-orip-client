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

Vue.use(Vuetify, {
    theme: {
        'primary': '#2F80ED'
    }
})
Vue.component('v-gravatar', Gravatar);

Vue.config.productionTip = false
deipRpc.api.setOptions({ url: 'ws://206.189.175.10:11011/' });
deipRpc.config.set('chain_id', 'fb29358afb5afc7a7307f0307a4965e65f1c7123087c259b3084a6e39ea584dd');

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