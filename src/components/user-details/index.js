import Vue from 'vue';

import UserDetailsSidebar from './components/UserDetailsSidebar';
import UserDetailsBody from './components/UserDetailsBody';
import UserEditEducationDialog from './components/UserEditEducationDialog';
import UserEditEmploymentDialog from './components/UserEditEmploymentDialog';
import UserClaimExpertiseDialog from './components/UserClaimExpertiseDialog';

Vue.component('user-details-sidebar', UserDetailsSidebar);
Vue.component('user-details-body', UserDetailsBody);
Vue.component('user-edit-education-dialog', UserEditEducationDialog);
Vue.component('user-edit-employment-dialog', UserEditEmploymentDialog);
Vue.component('user-claim-expertise-dialog', UserClaimExpertiseDialog);
