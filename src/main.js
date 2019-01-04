// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import deipRpc from '@deip/deip-rpc-client';

import App from './App';
import store from './store';
import router from './router';
import './index';
import './globals/index';

import 'vuetify/dist/vuetify.css';
import './styles/common.less';
import 'vue2-dropzone/dist/vue2Dropzone.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify, {
    theme: {
        'primary': '#2962FF'
    }
});

Vue.config.productionTip = false;

axios.get('/env')
    .then((env) => {
        window.env = env.data;
        deipRpc.api.setOptions({ url: window.env.DEIP_FULL_NODE_URL });
        deipRpc.config.set('chain_id', window.env.CHAIN_ID);
        console.log(window.env);

        /* eslint-disable no-new */
        window.app = new Vue({
            el: '#app',
            store,
            router,
            components: { App },
            template: '<App/>'
        });

        window.tenant = window.location.host.split('.')[0];
    })
    .catch((err) => {
        console.error(err)
    });
