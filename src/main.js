// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'

import  'vuetify/dist/vuetify.css'
import './styles/common.less'

import './components/core/index';
import './components/research/index';

Vue.use(Vuetify, {
    theme: {
        'deip-blue': '#2F80ED',
        'primary': '#2F80ED'
    }
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})
