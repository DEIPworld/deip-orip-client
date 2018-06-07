import Vue from 'vue';

// components/group-details
import ResearchGroupDetailsBody from './components/group-details/ResearchGroupDetailsBody';
import ResearchGroupDetailsSidebar from './components/group-details/ResearchGroupDetailsSidebar';
import ResearchGroupDetailsProposals from './components/group-details/ResearchGroupDetailsProposals';
import ResearchGroupDetailsProposalsItem from './components/group-details/ResearchGroupDetailsProposalsItem';
import AddMemberToGroupDialog from './components/group-details/AddMemberToGroupDialog';
Vue.component('research-group-details-body', ResearchGroupDetailsBody);
Vue.component('research-group-details-sidebar', ResearchGroupDetailsSidebar);
Vue.component('research-group-details-proposals', ResearchGroupDetailsProposals);
Vue.component('research-group-details-proposals-item', ResearchGroupDetailsProposalsItem);
Vue.component('add-member-to-group-dialog', AddMemberToGroupDialog);
