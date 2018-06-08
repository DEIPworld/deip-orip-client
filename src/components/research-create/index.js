import Vue from 'vue';

import CreateResearchPickDiscipline from './components/CreateResearchPickDiscipline';
import CreateResearchPickGroup from './components/CreateResearchPickGroup';
import CreateResearchMeta from './components/CreateResearchMeta';
import CreateResearchShare from './components/CreateResearchShare';
import CreateResearchRoadmap from './components/CreateResearchRoadmap';
Vue.component('create-research-pick-discipline', CreateResearchPickDiscipline);
Vue.component('create-research-pick-group', CreateResearchPickGroup);
Vue.component('create-research-meta', CreateResearchMeta);
Vue.component('create-research-share', CreateResearchShare);
Vue.component('create-research-roadmap', CreateResearchRoadmap);

import DisciplineTreePicker from './../common/disciplines/components/DisciplineTreePicker';
import DisciplineTreeItem from './../common/disciplines/components/DisciplineTreeItem';
import CreateNewResearch from './CreateNewResearch';
import ResearchStartCreating from './ResearchStartCreating';
Vue.component('discipline-tree-picker', DisciplineTreePicker);
Vue.component('discipline-tree-item', DisciplineTreeItem);
Vue.component('research-creating', CreateNewResearch);
Vue.component('research-start-creating', ResearchStartCreating);
