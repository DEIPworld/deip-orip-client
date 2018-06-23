import Vue from 'vue';

// components/group-details
import ResearchGroupDetailsBody from './components/ResearchGroupDetailsBody';
import ResearchGroupDetailsSidebar from './components/ResearchGroupDetailsSidebar';
import ResearchGroupDetailsProposals from './components/ResearchGroupDetailsProposals';
import ResearchGroupDetailsProposalsItem from './components/ResearchGroupDetailsProposalsItem';
import AddMemberToGroupDialog from './components/AddMemberToGroupDialog';

Vue.component('research-group-details-body', ResearchGroupDetailsBody);
Vue.component('research-group-details-sidebar', ResearchGroupDetailsSidebar);
Vue.component('research-group-details-proposals', ResearchGroupDetailsProposals);
Vue.component('research-group-details-proposals-item', ResearchGroupDetailsProposalsItem);
Vue.component('add-member-to-group-dialog', AddMemberToGroupDialog);