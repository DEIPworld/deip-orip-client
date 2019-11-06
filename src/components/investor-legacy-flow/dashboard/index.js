import Vue from 'vue';

import InvestorDashboardBody from './components/InvestorDashboardBody';
import InvestorDashboardSidebar from './components/InvestorDashboardSidebar';
import InvestorDashboardItemDetailsSidebar from './components/InvestorDashboardItemDetailsSidebar';
import InvestorDashbordAskReviewDialog from './components/InvestorDashbordAskReviewDialog';

Vue.component('investor-dashboard-body', InvestorDashboardBody);
Vue.component('investor-dashboard-sidebar', InvestorDashboardSidebar);
Vue.component('investor-dashboard-item-details-sidebar', InvestorDashboardItemDetailsSidebar);
Vue.component('investor-dashbord-ask-review-dialog', InvestorDashbordAskReviewDialog);
