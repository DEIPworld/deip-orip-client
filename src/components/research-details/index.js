import Vue from 'vue'

import ResearchDetailsSidebar from './components/ResearchDetailsSidebar'
import ResearchDetailsBody from './components/ResearchDetailsBody'
import ResearchTimeline from './components/ResearchTimeline'
import UploadResearchContentFileDialog from './components/UploadResearchContentFileDialog';
import WithdrawFundingRequestDialog from './components/WithdrawFundingRequestDialog';


Vue.component('research-details-sidebar', ResearchDetailsSidebar);
Vue.component('research-details-body', ResearchDetailsBody);
Vue.component('research-timeline', ResearchTimeline);
Vue.component('upload-research-content-file-dialog', UploadResearchContentFileDialog);
Vue.component('withdraw-funding-request-dialog', WithdrawFundingRequestDialog);