import Vue from 'vue'

import ResearchDetailsSidebar from './components/ResearchDetailsSidebar'
import ResearchDetailsBody from './components/ResearchDetailsBody'
import ResearchTimeline from './components/ResearchTimeline'
import ResearchDetails from './ResearchDetails'
import ReviewListItem from './components/ReviewListItem';
import AddResearchReviewDialog from './components/AddResearchReviewDialog';
import UploadResearchContentFileDialog from './components/UploadResearchContentFileDialog';


Vue.component('research-details-sidebar', ResearchDetailsSidebar);
Vue.component('research-details-body', ResearchDetailsBody);
Vue.component('research-timeline', ResearchTimeline);
Vue.component('research-details', ResearchDetails);
Vue.component('review-list-item', ReviewListItem);
Vue.component('add-research-review-dialog', AddResearchReviewDialog);
Vue.component('upload-research-contnet-file-dialog', UploadResearchContentFileDialog);