import Vue from 'vue';

// components/group-creating
import CreateResearchGroupTitle from './components/group-creating/CreateResearchGroupTitle';
import CreateResearchGroupDescription from './components/group-creating/CreateResearchGroupDescription';
import CreateResearchGroupMembers from './components/group-creating/CreateResearchGroupMembers';
import CreateResearchGroupShare from './components/group-creating/CreateResearchGroupShare';
Vue.component('create-research-group-title', CreateResearchGroupTitle);
Vue.component('create-research-group-description', CreateResearchGroupDescription);
Vue.component('create-research-group-members', CreateResearchGroupMembers);
Vue.component('create-research-group-share', CreateResearchGroupShare);

// components/group-details
import ResearchGroupDetailsBody from './components/group-details/ResearchGroupDetailsBody';
import ResearchGroupDetailsSidebar from './components/group-details/ResearchGroupDetailsSidebar';
import ResearchGroupDetailsProposals from './components/group-details/ResearchGroupDetailsProposals';
import ResearchGroupDetailsProposalsItem from './components/group-details/ResearchGroupDetailsProposalsItem';
Vue.component('research-group-details-body', ResearchGroupDetailsBody);
Vue.component('research-group-details-sidebar', ResearchGroupDetailsSidebar);
Vue.component('research-group-details-proposals', ResearchGroupDetailsProposals);
Vue.component('research-group-details-proposals-item', ResearchGroupDetailsProposalsItem);