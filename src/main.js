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

import config from './config';
import deipRpc from '@deip/deip-rpc';
import './index';
import './globals/index';

Vue.use(Vuetify, {
    theme: {
        'primary': '#2F80ED'
    }
});

Vue.config.productionTip = false;

deipRpc.api.setOptions({ url: config['deip-full-node-url'] });
deipRpc.config.set('chain_id', config['chain-id']);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
});
