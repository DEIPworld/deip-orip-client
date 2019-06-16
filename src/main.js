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
import 'vue2-dropzone/dist/vue2Dropzone.css';
import '@mdi/font/css/materialdesignicons.css';
import colors from 'vuetify/es5/util/colors';
import theme from './theme';

// Vue.use(Vuetify, {
//     theme: {
//         primary: colors.blue.accent4,
//         secondary: colors.blue.lighten4
//     },
//     options: {
//         customProperties: true
//     }
// });

Vue.config.productionTip = false;

axios.get('/env')
    .then((env) => {
        window.env = env.data;
        deipRpc.api.setOptions({ url: window.env.DEIP_FULL_NODE_URL });
        deipRpc.config.set('chain_id', window.env.CHAIN_ID);
        if (!window.env.TENANT) window.env.TENANT = "";

        window.env.THEME = theme[window.env.TENANT] 
            ? theme[window.env.TENANT] 
            : theme['default'];

        if (document && window.env.TENANT) {
            if (window.env.TENANT == "nsf") {
                document.title = "MyNSF - DEIP Grants Transparency";
            } else if (window.env.TENANT == "mit") {
                document.title = "MIT - DEIP Grants Transparency";
            } else if (window.env.TENANT == "treasury") {
                document.title = "U.S. Treasury - DEIP Grants Transparency";
            }
        }

        Vue.use(Vuetify, {
            theme: {
                primary: window.env.THEME['primary-color'],
                secondary: window.env.THEME['secondary-color']
            },
            options: {
                customProperties: true
            }
        });

        console.log(window.env);

        /* eslint-disable no-new */
        window.app = new Vue({
            el: '#app',
            store,
            router,
            components: { App },
            template: '<App/>'
        });
    })
    .catch((err) => {
        console.error(err)
    });
