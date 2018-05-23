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

// components
import DisciplineTreePicker from './components/DisciplineTreePicker';
import DisciplineTreeItem from './components/DisciplineTreeItem';
import ResearchCreating from './components/ResearchCreating';
import ResearchStartCreating from './components/ResearchStartCreating';
import StateResearchList from './components/StateResearchList';
Vue.component('discipline-tree-picker', DisciplineTreePicker);
Vue.component('discipline-tree-item', DisciplineTreeItem);
Vue.component('research-creating', ResearchCreating);
Vue.component('research-start-creating', ResearchStartCreating);
Vue.component('state-research-list', StateResearchList);