import Vue from 'vue'

import TokenSaleAmount from './components/TokenSaleAmount';
import TokenSalePeriod from './components/TokenSalePeriod';
import TokenSaleCaps from './components/TokenSaleCaps';
import CreateTokenSale from './components/CreateTokenSale';


Vue.component('create-token-sale', CreateTokenSale);
Vue.component('token-sale-amount', TokenSaleAmount);
Vue.component('token-sale-period', TokenSalePeriod);
Vue.component('token-sale-caps', TokenSaleCaps);
