import Vue from 'vue';
import ResearchApplicationDetails from './ResearchApplicationDetails';
import ResearchApplicationDetailsFile from './components/ResearchApplicationDetailsFile';
import ResearchApplicationDetailsSidebar from './components/ResearchApplicationDetailsSidebar';

import ResearchApplicationAddReview from './ResearchApplicationAddReview';
import ResearchApplicationAddReviewBody from './components/ResearchApplicationAddReviewBody';
import ResearchApplicationAddReviewSidebar from './components/ResearchApplicationAddReviewSidebar';

import ResearchApplicationReview from './ResearchApplicationReview';
import ResearchApplicationReviewBody from './components/ResearchApplicationReviewBody';
import ResearchApplicationReviewSidebar from './components/ResearchApplicationReviewSidebar';
import ApplicationReviewListItem from './components/ApplicationReviewListItem';

Vue.component('research-application-details', ResearchApplicationDetails);
Vue.component('research-application-details-file', ResearchApplicationDetailsFile);
Vue.component('research-application-details-sidebar', ResearchApplicationDetailsSidebar);

Vue.component('research-application-add-review', ResearchApplicationAddReview);
Vue.component('research-application-add-review-body', ResearchApplicationAddReviewBody);
Vue.component('research-application-add-review-sidebar', ResearchApplicationAddReviewSidebar);

Vue.component('research-application-review', ResearchApplicationReview);
Vue.component('research-application-review-body', ResearchApplicationReviewBody);
Vue.component('research-application-review-sidebar', ResearchApplicationReviewSidebar);
Vue.component('application-review-list-item', ApplicationReviewListItem);