import Vue from 'vue';
import ResearchContentDetails from './ResearchContentDetails';
import ResearchContentDetailsSidebar from './components/ResearchContentDetailsSidebar';
import ResearchContentDetailsPackage from './components/ResearchContentDetailsPackage';
import ReferencesDependencyGraph from './components/ReferencesDependencyGraph';

Vue.component('research-content-details', ResearchContentDetails);
Vue.component('research-content-details-package', ResearchContentDetailsPackage);
Vue.component('research-content-details-sidebar', ResearchContentDetailsSidebar);
Vue.component('references-dependency-graph', ReferencesDependencyGraph);
