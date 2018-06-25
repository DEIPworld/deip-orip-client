// importing of all project components

import Vue from 'vue'

import './components/layout/index';
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

import Gravatar from 'vue-gravatar';
Vue.component('v-gravatar', Gravatar);