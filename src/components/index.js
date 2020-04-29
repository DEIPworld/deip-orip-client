// importing of all project components

import Vue from 'vue';

import './layout/index';
import './common/index';
import './user-details/index';
import './research-feed/index';
import './research-create/index';
import './research-edit/index';
import './research-content-details/index';
import './research-group-details/index';
import './research-group-create/index';
import './token-sale-create/index';
import './user-wallet/index';
import './claim-expertise-details/index';
import './claim-expertise-list/index';
import './research-application-details/index';
import './dashboard/index';
import './investor-portfolio/index';
import './user-settings/index';
import './research-group-settings/index';
import './agency-grant-program-create/index';
import './agency-grant-programs/index';
import './agency-grant-program-details/index';
import './agency-grant-program-award-create/index';
import './agency-grant-program-award-details/index';

import Gravatar from 'vue-gravatar';

import VueQrcode from '@xkeshi/vue-qrcode';

Vue.component('v-gravatar', Gravatar);
Vue.component(VueQrcode.name, VueQrcode);
