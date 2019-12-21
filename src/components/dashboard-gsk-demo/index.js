import Vue from 'vue'
import ProjectsListSectionGskDemo from './components/ProjectsListSectionGskDemo';
import ActivityLogSectionGskDemo from './components/ActivityLogSectionGskDemo';
import AccessRequestsSectionGskDemo from './components/AccessRequestsSectionGskDemo';

import ResearchProposalActivityLogEntry from './components/activity-log-entries/ResearchProposalActivityLogEntry';
import ResearchContentProposalActivityLogEntry from './components/activity-log-entries/ResearchContentProposalActivityLogEntry';
import InviteProposalActivityLogEntry from './components/activity-log-entries/InviteProposalActivityLogEntry';
import TokenSaleProposalActivityLogEntry from './components/activity-log-entries/TokenSaleProposalActivityLogEntry';
import ProposalVoteActivityLogEntry from './components/activity-log-entries/ProposalVoteActivityLogEntry';
import InvitationApprovedActivityLogEntry from './components/activity-log-entries/InvitationApprovedActivityLogEntry';
import InvitationRejectedActivityLogEntry from './components/activity-log-entries/InvitationRejectedActivityLogEntry';
import ResearchContentExpertReviewActivityLogEntry from './components/activity-log-entries/ResearchContentExpertReviewActivityLogEntry';
import ResearchContentExpertReviewRequestActivityLogEntry from './components/activity-log-entries/ResearchContentExpertReviewRequestActivityLogEntry';
import ResearchContentAccessRequestActivityLogEntry from './components/activity-log-entries/ResearchContentAccessRequestActivityLogEntry';
import ResearchContentAccessRequestApprovedActivityLogEntry from './components/activity-log-entries/ResearchContentAccessRequestApprovedActivityLogEntry';
import ResearchContentAccessRequestRejectedActivityLogEntry from './components/activity-log-entries/ResearchContentAccessRequestRejectedActivityLogEntry';


Vue.component('projects-list-section-gsk-demo', ProjectsListSectionGskDemo);
Vue.component('activity-log-section-gsk-demo', ActivityLogSectionGskDemo);
Vue.component('access-requests-section-gsk-demo', AccessRequestsSectionGskDemo);

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