import Vue from 'vue';

import UserDetails from './components/UserDetails';
import UserDetailsSidebar from './components/details/UserDetailsSidebar';
import UserDetailsBody from './components/details/UserDetailsBody';
import UserEditEducationDialog from './components/details/UserEditEducationDialog';
import UserEditEmploymentDialog from './components/details/UserEditEmploymentDialog';

import TokenSaleAmount from './components/token-sale/TokenSaleAmount';
import TokenSalePeriod from './components/token-sale/TokenSalePeriod';
import TokenSaleCaps from './components/token-sale/TokenSaleCaps';

Vue.component('user-details', UserDetails);
Vue.component('user-details-sidebar', UserDetailsSidebar);
Vue.component('user-details-body', UserDetailsBody);
Vue.component('user-edit-education-dialog', UserEditEducationDialog);
Vue.component('user-edit-employment-dialog', UserEditEmploymentDialog);

Vue.component('token-sale-amount', TokenSaleAmount);
Vue.component('token-sale-period', TokenSalePeriod);
Vue.component('token-sale-caps', TokenSaleCaps);