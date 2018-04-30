// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.css'
import './styles/common.less'

import './components/core/index';
import './components/research/index';
import './components/user/index';

import '../deip-rpc/dist/deip.min';

Vue.use(Vuetify, {
    theme: {
        'primary': '#2F80ED'
    }
})
Vue.config.productionTip = false

deipRpc.api.setOptions({ url: 'ws://206.189.175.10:11011/' });
deipRpc.config.set('chain_id', 'd39f9b0d2ed1fd88747e87cab0ac2e6a6708782e70f3e9333f5c782c2d0a5d3d');

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})