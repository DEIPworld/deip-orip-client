// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router';
import Vuetify from 'vuetify';

import 'vuetify/dist/vuetify.css';
import './styles/common.less';
import 'vue2-dropzone/dist/vue2Dropzone.css';
import '@mdi/font/css/materialdesignicons.css';

import deipRpc from '@deip/deip-rpc-client';
import './index';
import './globals/index';

Vue.use(Vuetify, {
    theme: {
        'primary': '#2962FF'
    }
});

Vue.config.productionTip = false;

deipRpc.api.setOptions({ url: process.env.DEIP_FULL_NODE_URL });
deipRpc.config.set('chain_id', process.env.CHAIN_ID);

/* eslint-disable no-new */
window.deipApp = new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
});
