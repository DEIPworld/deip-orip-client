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

import DisciplineTreePicker from './../research/components/DisciplineTreePicker';
import DisciplineTreeItem from './../research/components/DisciplineTreeItem';
import ResearchCreating from './ResearchCreating';
import ResearchStartCreating from './ResearchStartCreating';
Vue.component('discipline-tree-picker', DisciplineTreePicker);
Vue.component('discipline-tree-item', DisciplineTreeItem);
Vue.component('research-creating', ResearchCreating);
Vue.component('research-start-creating', ResearchStartCreating);
