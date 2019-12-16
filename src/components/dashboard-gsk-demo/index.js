import Vue from 'vue'
import ProjectsListSectionGskDemo from './components/ProjectsListSectionGskDemo';
import ActivityLogSectionGskDemo from './components/ActivityLogSectionGskDemo';
import AccessRequestsSectionGskDemo from './components/AccessRequestsSectionGskDemo';

import ResearchProposalActivityLogEntry from './components/activity-log-entries/ResearchProposalActivityLogEntry';
import ResearchContentProposalActivityLogEntry from './components/activity-log-entries/ResearchContentProposalActivityLogEntry';
import InviteProposalActivityLogEntry from './components/activity-log-entries/InviteProposalActivityLogEntry';
import TokenSaleProposalActivityLogEntry from './components/activity-log-entries/TokenSaleProposalActivityLogEntry';

Vue.component('projects-list-section-gsk-demo', ProjectsListSectionGskDemo);
Vue.component('activity-log-section-gsk-demo', ActivityLogSectionGskDemo);
Vue.component('access-requests-section-gsk-demo', AccessRequestsSectionGskDemo);

Vue.component('research-proposal-activity-log-entry', ResearchProposalActivityLogEntry);
Vue.component('research-content-proposal-activity-log-entry', ResearchContentProposalActivityLogEntry);
Vue.component('invite-proposal-activity-log-entry', InviteProposalActivityLogEntry);
Vue.component('token-sale-proposal-activity-log-entry', TokenSaleProposalActivityLogEntry);