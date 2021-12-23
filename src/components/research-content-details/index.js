import Vue from 'vue';
import ProjectContentDetails from './ResearchContentDetails';
import ProjectContentDetailsSidebar from './components/ResearchContentDetailsSidebar';
import ProjectContentDetailsPackage from './components/ResearchContentDetailsPackage';
import ReferencesDependencyGraph from './components/ReferencesDependencyGraph';

Vue.component('project-content-details', ProjectContentDetails);
Vue.component('project-content-details-package', ProjectContentDetailsPackage);
Vue.component('project-content-details-sidebar', ProjectContentDetailsSidebar);
Vue.component('references-dependency-graph', ReferencesDependencyGraph);
