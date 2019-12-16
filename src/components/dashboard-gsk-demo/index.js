import Vue from 'vue'
import ProjectsListSectionGskDemo from './components/ProjectsListSectionGskDemo';
import ActivityLogSectionGskDemo from './components/ActivityLogSectionGskDemo';
import AccessRequestsSectionGskDemo from './components/AccessRequestsSectionGskDemo';

import ResearchProposalActivityLogEntry from './components/activity-log-entries/ResearchProposalActivityLogEntry';
import ResearchContentProposalActivityLogEntry from './components/activity-log-entries/ResearchContentProposalActivityLogEntry';
import InviteProposalActivityLogEntry from './components/activity-log-entries/InviteProposalActivityLogEntry';
import TokenSaleProposalActivityLogEntry from './components/activity-log-entries/TokenSaleProposalActivityLogEntry';
import VoteProposalActivityLogEntry from './components/activity-log-entries/VoteProposalActivityLogEntry';
import ApprovedInvitationActivityLogEntry from './components/activity-log-entries/ApprovedInvitationActivityLogEntry';
import RejectedInvitationActivityLogEntry from './components/activity-log-entries/RejectedInvitationActivityLogEntry';
import ResearchContentExpertReviewActivityLogEntry from './components/activity-log-entries/ResearchContentExpertReviewActivityLogEntry';
import ResearchContentExpertReviewRequestActivityLogEntry from './components/activity-log-entries/ResearchContentExpertReviewRequestActivityLogEntry';
import ResearchContentAccessRequestActivityLogEntry from './components/activity-log-entries/ResearchContentAccessRequestActivityLogEntry';


Vue.component('projects-list-section-gsk-demo', ProjectsListSectionGskDemo);
Vue.component('activity-log-section-gsk-demo', ActivityLogSectionGskDemo);
Vue.component('access-requests-section-gsk-demo', AccessRequestsSectionGskDemo);

Vue.component('research-proposal-activity-log-entry', ResearchProposalActivityLogEntry);
Vue.component('research-content-proposal-activity-log-entry', ResearchContentProposalActivityLogEntry);
Vue.component('invite-proposal-activity-log-entry', InviteProposalActivityLogEntry);
Vue.component('token-sale-proposal-activity-log-entry', TokenSaleProposalActivityLogEntry);
Vue.component('vote-proposal-activity-log-entry', VoteProposalActivityLogEntry);
Vue.component('approved-invitation-activity-log-entry', ApprovedInvitationActivityLogEntry);
Vue.component('rejected-invitation-activity-log-entry', RejectedInvitationActivityLogEntry);
Vue.component('research-content-expert-review-activity-log-entry', ResearchContentExpertReviewActivityLogEntry);
Vue.component('research-content-expert-review-request-activity-log-entry', ResearchContentExpertReviewRequestActivityLogEntry);
Vue.component('research-content-access-request-activity-log-entry', ResearchContentAccessRequestActivityLogEntry);