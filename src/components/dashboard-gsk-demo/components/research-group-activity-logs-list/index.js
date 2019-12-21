
import Vue from 'vue';
import ResearchGroupActivityLogList from './ResearchGroupActivityLogList';
import ResearchProposalActivityLogEntry from './components/ResearchProposalActivityLogEntry';
import ResearchContentProposalActivityLogEntry from './components/ResearchContentProposalActivityLogEntry';
import InviteProposalActivityLogEntry from './components/InviteProposalActivityLogEntry';
import TokenSaleProposalActivityLogEntry from './components/TokenSaleProposalActivityLogEntry';
import ProposalVoteActivityLogEntry from './components/ProposalVoteActivityLogEntry';
import InvitationApprovedActivityLogEntry from './components/InvitationApprovedActivityLogEntry';
import InvitationRejectedActivityLogEntry from './components/InvitationRejectedActivityLogEntry';
import ResearchContentExpertReviewActivityLogEntry from './components/ResearchContentExpertReviewActivityLogEntry';
import ResearchContentExpertReviewRequestActivityLogEntry from './components/ResearchContentExpertReviewRequestActivityLogEntry';
import ResearchContentAccessRequestActivityLogEntry from './components/ResearchContentAccessRequestActivityLogEntry';
import ResearchContentAccessRequestApprovedActivityLogEntry from './components/ResearchContentAccessRequestApprovedActivityLogEntry';
import ResearchContentAccessRequestRejectedActivityLogEntry from './components/ResearchContentAccessRequestRejectedActivityLogEntry';


Vue.component('research-group-activity-log-list', ResearchGroupActivityLogList);
Vue.component('research-proposal-activity-log-entry', ResearchProposalActivityLogEntry);
Vue.component('research-content-proposal-activity-log-entry', ResearchContentProposalActivityLogEntry);
Vue.component('invite-proposal-activity-log-entry', InviteProposalActivityLogEntry);
Vue.component('token-sale-proposal-activity-log-entry', TokenSaleProposalActivityLogEntry);
Vue.component('proposal-vote-activity-log-entry', ProposalVoteActivityLogEntry);
Vue.component('invitation-approved-activity-log-entry', InvitationApprovedActivityLogEntry);
Vue.component('invitation-rejected-activity-log-entry', InvitationRejectedActivityLogEntry);
Vue.component('research-content-expert-review-activity-log-entry', ResearchContentExpertReviewActivityLogEntry);
Vue.component('research-content-expert-review-request-activity-log-entry', ResearchContentExpertReviewRequestActivityLogEntry);
Vue.component('research-content-access-request-activity-log-entry', ResearchContentAccessRequestActivityLogEntry);
Vue.component('research-content-access-request-approved-activity-log-entry', ResearchContentAccessRequestApprovedActivityLogEntry);
Vue.component('research-content-access-request-rejected-activity-log-entry', ResearchContentAccessRequestRejectedActivityLogEntry);