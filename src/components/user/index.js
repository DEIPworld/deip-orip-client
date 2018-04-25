import Vue from 'vue';

import UserDetails from './components/UserDetails';
import UserDetailsSidebar from './components/UserDetailsSidebar';
import TokenSaleAmount from './components/token-sale/TokenSaleAmount';
import TokenSalePeriod from './components/token-sale/TokenSalePeriod';
import TokenSaleCaps from './components/token-sale/TokenSaleCaps';

Vue.component('user-details', UserDetails);
Vue.component('user-details-sidebar', UserDetailsSidebar);
Vue.component('token-sale-amount', TokenSaleAmount);
Vue.component('token-sale-period', TokenSalePeriod);
Vue.component('token-sale-caps', TokenSaleCaps);