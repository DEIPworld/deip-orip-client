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
import ExclusionProposalUserNotification from './components/ExclusionProposalUserNotification';
import ExclusionUserNotification from './components/ExclusionUserNotification';


Vue.component('user-notifications-list', UserNotificationsList);
Vue.component('research-proposal-user-notification', ResearchProposalUserNotification);
Vue.component('research-content-proposal-user-notification', ResearchContentProposalUserNotification);
Vue.component('token-sale-proposal-user-notification', TokenSaleProposalUserNotification);
Vue.component('invite-proposal-user-notification', InviteProposalUserNotification);
Vue.component('invitation-user-notification', InvitationUserNotification);
Vue.component('invitation-approved-user-notification', InvitationApprovedUserNotification);
Vue.component('invitation-rejected-user-notification', InvitationRejectedUserNotification);
Vue.component('exclusion-proposal-user-notification', ExclusionProposalUserNotification);
Vue.component('exclusion-user-notification', ExclusionUserNotification);
Vue.component('expert-review-user-notification', ExpertReviewUserNotification);
Vue.component('expert-review-request-user-notification', ExpertReviewRequestUserNotification);