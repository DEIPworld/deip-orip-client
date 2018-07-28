import Vue from 'vue';

import CreateResearchGroupTitle from './components/CreateResearchGroupTitle';
import CreateResearchGroupDescription from './components/CreateResearchGroupDescription';
import CreateResearchGroupMembers from './components/CreateResearchGroupMembers';
import CreateResearchGroupShare from './components/CreateResearchGroupShare';
import CreateResearchGroupQuorum from './components/CreateResearchGroupQuorum';


Vue.component('create-research-group-title', CreateResearchGroupTitle);
Vue.component('create-research-group-description', CreateResearchGroupDescription);
Vue.component('create-research-group-members', CreateResearchGroupMembers);
Vue.component('create-research-group-share', CreateResearchGroupShare);
Vue.component('create-research-group-quorum', CreateResearchGroupQuorum);
