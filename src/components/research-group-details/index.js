import Vue from 'vue';

// components/group-details
import ResearchGroupDetailsProposals from './components/ResearchGroupDetailsProposals';
import ResearchGroupDetailsProposalsItem from './components/ResearchGroupDetailsProposalsItem';
import AddMemberToGroupDialog from './components/AddMemberToGroupDialog';
import TransferGroupDeipTokensDialog from './components/TransferGroupDeipTokensDialog';
import QuorumSizeSidebarSection from './components/QuorumSizeSidebarSection';

Vue.component('research-group-details-proposals', ResearchGroupDetailsProposals);
Vue.component('research-group-details-proposals-item', ResearchGroupDetailsProposalsItem);
Vue.component('add-member-to-group-dialog', AddMemberToGroupDialog);
Vue.component('transfer-group-deip-tokens-dialog', TransferGroupDeipTokensDialog);
Vue.component('quorum-size-sidebar-section', QuorumSizeSidebarSection);
