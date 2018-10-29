import Vue from 'vue';
import ResearchContentDetails from './ResearchContentDetails';
import ResearchContentDetailsDar from './components/ResearchContentDetailsDar';
import ResearchContentDetailsFile from './components/ResearchContentDetailsFile';
import ResearchContentDetailsSidebar from './components/ResearchContentDetailsSidebar';

import ResearchContentAddReviewBody from './components/ResearchContentAddReviewBody';
import ResearchContentAddReviewSidebar from './components/ResearchContentAddReviewSidebar';

Vue.component('research-content-details', ResearchContentDetails);
Vue.component('research-content-details-dar', ResearchContentDetailsDar);
Vue.component('research-content-details-file', ResearchContentDetailsFile);
Vue.component('research-content-details-sidebar', ResearchContentDetailsSidebar);
Vue.component('research-content-add-review-body', ResearchContentAddReviewBody);
Vue.component('research-content-add-review-sidebar', ResearchContentAddReviewSidebar);