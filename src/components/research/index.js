import Vue from 'vue';

// components/creating
import CreateResearchPickDiscipline from './components/creating/CreateResearchPickDiscipline';
import CreateResearchPickGroup from './components/creating/CreateResearchPickGroup';
import CreateResearchMeta from './components/creating/CreateResearchMeta';
import CreateResearchShare from './components/creating/CreateResearchShare';
import CreateResearchRoadmap from './components/creating/CreateResearchRoadmap';
Vue.component('create-research-pick-discipline', CreateResearchPickDiscipline);
Vue.component('create-research-pick-group', CreateResearchPickGroup);
Vue.component('create-research-meta', CreateResearchMeta);
Vue.component('create-research-share', CreateResearchShare);
Vue.component('create-research-roadmap', CreateResearchRoadmap);

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
Vue.component('research-group-details-body', ResearchGroupDetailsBody);
Vue.component('research-group-details-sidebar', ResearchGroupDetailsSidebar);
Vue.component('research-group-details-proposals', ResearchGroupDetailsProposals);

// components
import DisciplineTreePicker from './components/DisciplineTreePicker';
import DisciplineTreeItem from './components/DisciplineTreeItem';
import ResearchCreating from './components/ResearchCreating';
import ResearchStartCreating from './components/ResearchStartCreating';
import StateResearchList from './components/StateResearchList';
import ResearchGroupDetails from './components/ResearchGroupDetails';
Vue.component('discipline-tree-picker', DisciplineTreePicker);
Vue.component('discipline-tree-item', DisciplineTreeItem);
Vue.component('research-creating', ResearchCreating);
Vue.component('research-start-creating', ResearchStartCreating);
Vue.component('state-research-list', StateResearchList);
Vue.component('research-group-details', ResearchGroupDetails);