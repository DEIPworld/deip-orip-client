import Vue from 'vue'

import ResearchDetailsSidebar from './components/ResearchDetailsSidebar'
import ResearchDetailsBody from './components/ResearchDetailsBody'
import ResearchTimeline from './components/ResearchTimeline'
import ResearchDetails from './ResearchDetails'
import UploadResearchContentFileDialog from './components/UploadResearchContentFileDialog';


Vue.component('research-details-sidebar', ResearchDetailsSidebar);
Vue.component('research-details-body', ResearchDetailsBody);
Vue.component('research-timeline', ResearchTimeline);
Vue.component('research-details', ResearchDetails);
Vue.component('upload-research-contnet-file-dialog', UploadResearchContentFileDialog);