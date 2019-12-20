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
import ApprovedInvitationUserNotification from './components/user-notificatons/ApprovedInvitationUserNotification';
import RejectedInvitationUserNotification from './components/user-notificatons/RejectedInvitationUserNotification';
import ExpertReviewUserNotification from './components/user-notificatons/ExpertReviewUserNotification';
import ExpertReviewRequestUserNotification from './components/user-notificatons/ExpertReviewRequestUserNotification'


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
Vue.component('approved-invitation-user-notification', ApprovedInvitationUserNotification);
Vue.component('rejected-invitation-user-notification', RejectedInvitationUserNotification);
Vue.component('expert-review-user-notification', ExpertReviewUserNotification);
Vue.component('expert-review-request-user-notification', ExpertReviewRequestUserNotification);