// importing of all project components

import Vue from 'vue';

import './layout/index';
import './common/index';
import './research-content-details/index';
import './research-group-details/index';
import './research-group-create/index';
import './dashboard/index';
import './agency-grant-program-create/index';
import './agency-grant-programs/index';
import './agency-grant-program-award-create/index';
import './agency-grant-program-award-details/index';

import Gravatar from 'vue-gravatar';

import VueQrcode from '@xkeshi/vue-qrcode';

Vue.component('VGravatar', Gravatar);
Vue.component(VueQrcode.name, VueQrcode);
