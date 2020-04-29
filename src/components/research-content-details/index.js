import Vue from 'vue';
import ResearchContentDetails from './ResearchContentDetails';
import ResearchContentDetailsDar from './components/ResearchContentDetailsDar';
import ResearchContentDetailsSidebar from './components/ResearchContentDetailsSidebar';

import ResearchContentReviewBody from './components/ResearchContentReviewBody';
import ResearchContentReviewSidebar from './components/ResearchContentReviewSidebar';

import ResearchContentAddReviewBody from './components/ResearchContentAddReviewBody';
import ResearchContentAddReviewSidebar from './components/ResearchContentAddReviewSidebar';
import ResearchContentDetailsPackage from './components/ResearchContentDetailsPackage';
import ReferencesDependencyGraph from './components/ReferencesDependencyGraph';
import ResearchContentDetailsECI from './components/ResearchContentDetailsECI';


Vue.component('research-content-details', ResearchContentDetails);
Vue.component('research-content-details-dar', ResearchContentDetailsDar);
Vue.component('research-content-details-package', ResearchContentDetailsPackage);
Vue.component('research-content-details-sidebar', ResearchContentDetailsSidebar);
Vue.component('research-content-review-body', ResearchContentReviewBody);
Vue.component('research-content-review-sidebar', ResearchContentReviewSidebar);
Vue.component('research-content-add-review-body', ResearchContentAddReviewBody);
Vue.component('research-content-add-review-sidebar', ResearchContentAddReviewSidebar);
Vue.component('references-dependency-graph', ReferencesDependencyGraph);
Vue.component('research-content-details-eci', ResearchContentDetailsECI);
