import Vue from 'vue';
import UserNotificationsList from './UserNotificationsList';
import ResearchProposalUserNotification from './components/ResearchProposalUserNotification';
import ResearchContentProposalUserNotification from './components/ResearchContentProposalUserNotification';
import TokenSaleProposalUserNotification from './components/TokenSaleProposalUserNotification';
import InviteProposalUserNotification from './components/InviteProposalUserNotification';
import InvitationUserNotification from './components/InvitationUserNotification';
import InvitationApprovedUserNotification from './components/InvitationApprovedUserNotification';
import InvitationRejectedUserNotification from './components/InvitationRejectedUserNotification';
import ExpertReviewUserNotification from './components/ExpertReviewUserNotification';
import ExpertReviewRequestUserNotification from './components/ExpertReviewRequestUserNotification';
import ResearchContentAccessRequestUserNotification from './components/ResearchContentAccessRequestUserNotification';
import ResearchContentAccessRequestApprovedUserNotification from './components/ResearchContentAccessRequestApprovedUserNotification';
import ResearchContentAccessRequestRejectedUserNotification from './components/ResearchContentAccessRequestRejectedUserNotification';


Vue.component('user-notifications-list', UserNotificationsList);
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