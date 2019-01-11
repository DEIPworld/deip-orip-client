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
import './components/grant-create/index';
import './components/claim-expertise-details/index';
import './components/claim-expertise-list/index';
import './components/funding-opportunity-announcement-create/index';
import './components/agency-programs/index';
import './components/agency-program-details/index';
import './components/research-application-details/index';
import './components/investor-flow/index';

import Gravatar from 'vue-gravatar';
Vue.component('v-gravatar', Gravatar);

import VueQrcode from '@xkeshi/vue-qrcode';
Vue.component(VueQrcode.name, VueQrcode);

import VueGoogleCharts from 'vue-google-charts';
Vue.use(VueGoogleCharts);
