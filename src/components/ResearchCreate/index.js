import Vue from 'vue';

import CreateResearchPickDiscipline from './components/CreateResearchPickDiscipline';
import CreateResearchPickGroup from './components/CreateResearchPickGroup';
import CreateResearchMeta from './components/CreateResearchMeta';
import CreateResearchShare from './components/CreateResearchShare';
import CreateResearchRoadmap from './components/CreateResearchRoadmap';
import CreateResearchSettings from './components/CreateResearchSettings';

import CreateNewResearch from './CreateNewResearch';
import ResearchStartCreating from './ResearchStartCreating';

Vue.component('create-research-pick-discipline', CreateResearchPickDiscipline);
Vue.component('create-research-pick-group', CreateResearchPickGroup);
Vue.component('create-research-meta', CreateResearchMeta);
Vue.component('create-research-share', CreateResearchShare);
Vue.component('create-research-roadmap', CreateResearchRoadmap);
Vue.component('create-research-settings', CreateResearchSettings);
Vue.component('research-creating', CreateNewResearch);
Vue.component('research-start-creating', ResearchStartCreating);
