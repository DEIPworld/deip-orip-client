import Vue from 'vue';

import DeipTokenSendForm from './components/DeipTokenSendForm';
import CommonTokenConvertForm from './components/CommonTokenConvertForm';
import ResearchTokenSendForm from './components/ResearchTokenSendForm';
import VCreditCard from 'v-credit-card';
import 'v-credit-card/dist/VCreditCard.css';

Vue.component('deip-token-send-form', DeipTokenSendForm);
Vue.component('common-token-convert-form', CommonTokenConvertForm);
Vue.component('research-token-send-form', ResearchTokenSendForm);
Vue.component('v-credit-card', VCreditCard);