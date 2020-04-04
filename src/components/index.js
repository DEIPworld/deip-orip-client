// importing of all project components

import Vue from 'vue'

import './layout/index';
import './common/index';
import './user-details/index';
import './research-feed/index'
import './research-create/index';
import './research-details/index';
import './research-edit/index';
import './research-content-details/index';
import './research-group-details/index';
import './research-group-create/index';
import './token-sale-create/index';
import './user-wallet/index';
import './grant-create/index';
import './claim-expertise-details/index';
import './claim-expertise-list/index';
import './funding-opportunity-announcement-create/index';
import './agency-programs/index';
import './agency-program-details/index';
import './research-application-details/index';
import './dashboard/index';
import './investor-dashboard/index';
import './user-settings/index';
import './research-group-settings/index';
import './funding-opportunity-award-proposal/index';

import Gravatar from 'vue-gravatar';
Vue.component('v-gravatar', Gravatar);

import VueQrcode from '@xkeshi/vue-qrcode';
Vue.component(VueQrcode.name, VueQrcode);
