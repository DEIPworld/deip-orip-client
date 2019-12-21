import Vue from 'vue';

import Toolbar from './components/Toolbar';
import GlobalLoader from './components/GlobalLoader';
import Sidebar from './components/Sidebar';
import Contentbar from './components/Contentbar';
import PageContainer from './components/PageContainer';
import SidebarSplittedBtn from './components/SidebarSplittedBtn';
import NotificationsList from './components/NotificationsList';
import BasePageLayout from './components/BasePageLayout';

import ResearchProposalUserNotification from './components/user-notificatons/ResearchProposalUserNotification';
import ResearchContentProposalUserNotification from './components/user-notificatons/ResearchContentProposalUserNotification';
import TokenSaleProposalUserNotification from './components/user-notificatons/TokenSaleProposalUserNotification';
import InviteProposalUserNotification from './components/user-notificatons/InviteProposalUserNotification';
import InvitationUserNotification from './components/user-notificatons/InvitationUserNotification';
import InvitationApprovedUserNotification from './components/user-notificatons/InvitationApprovedUserNotification';
import InvitationRejectedUserNotification from './components/user-notificatons/InvitationRejectedUserNotification';
import ExpertReviewUserNotification from './components/user-notificatons/ExpertReviewUserNotification';
import ExpertReviewRequestUserNotification from './components/user-notificatons/ExpertReviewRequestUserNotification';
import ResearchContentAccessRequestUserNotification from './components/user-notificatons/ResearchContentAccessRequestUserNotification';
import ResearchContentAccessRequestApprovedUserNotification from './components/user-notificatons/ResearchContentAccessRequestApprovedUserNotification';
import ResearchContentAccessRequestRejectedUserNotification from './components/user-notificatons/ResearchContentAccessRequestRejectedUserNotification';


Vue.component('toolbar', Toolbar);
Vue.component('global-loader', GlobalLoader);
Vue.component('sidebar', Sidebar);
Vue.component('contentbar', Contentbar);
Vue.component('page-container', PageContainer);
Vue.component('sidebar-splitted-btn', SidebarSplittedBtn);
Vue.component('notifications-list', NotificationsList);
Vue.component('base-page-layout', BasePageLayout);

Vue.component('research-proposal-user-notification', ResearchProposalUserNotification);
Vue.component('research-content-proposal-user-notification', ResearchContentProposalUserNotification);
Vue.component('token-sale-proposal-user-notification', TokenSaleProposalUserNotification);
Vue.component('invite-proposal-user-notification', InviteProposalUserNotification);
Vue.component('invitation-user-notification', InvitationUserNotification);
Vue.component('invitation-approved-user-notification', InvitationApprovedUserNotification);
Vue.component('invitation-rejected-user-notification', InvitationRejectedUserNotification);
Vue.component('expert-review-user-notification', ExpertReviewUserNotification);
Vue.component('expert-review-request-user-notification', ExpertReviewRequestUserNotification);
Vue.component('research-content-access-request-user-notification', ResearchContentAccessRequestUserNotification);
Vue.component('research-content-access-request-approved-user-notification', ResearchContentAccessRequestApprovedUserNotification);
Vue.component('research-content-access-request-rejected-user-notification', ResearchContentAccessRequestRejectedUserNotification);