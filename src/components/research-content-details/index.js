import Vue from 'vue';
import ResearchContentDetails from './ResearchContentDetails';
import ResearchContentDetailsDar from './components/ResearchContentDetailsDar';
import ResearchContentDetailsFile from './components/ResearchContentDetailsFile';
import ResearchContentDetailsSidebar from './components/ResearchContentDetailsSidebar';

import ResearchContentReviewBody from './components/ResearchContentReviewBody';
import ResearchContentReviewSidebar from './components/ResearchContentReviewSidebar';

import ResearchContentAddReviewBody from './components/ResearchContentAddReviewBody';
import ResearchContentAddReviewSidebar from './components/ResearchContentAddReviewSidebar';

import ReviewListItem from './components/ReviewListItem';
import ResearchContentDetailsReviewTabChart from './components/ResearchContentDetailsReviewTabChart';
import ResearchContentDetailsReviewChart from './components/ResearchContentDetailsReviewChart';

Vue.component('research-content-details', ResearchContentDetails);
Vue.component('research-content-details-dar', ResearchContentDetailsDar);
Vue.component('research-content-details-file', ResearchContentDetailsFile);
Vue.component('research-content-details-sidebar', ResearchContentDetailsSidebar);
Vue.component('research-content-review-body', ResearchContentReviewBody);
Vue.component('research-content-review-sidebar', ResearchContentReviewSidebar);
Vue.component('research-content-add-review-body', ResearchContentAddReviewBody);
Vue.component('research-content-add-review-sidebar', ResearchContentAddReviewSidebar);
Vue.component('review-list-item', ReviewListItem);
Vue.component('research-content-details-review-tab-chart', ResearchContentDetailsReviewTabChart);
Vue.component('research-content-details-review-chart', ResearchContentDetailsReviewChart);
