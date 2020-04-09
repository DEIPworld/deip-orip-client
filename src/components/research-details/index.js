import Vue from 'vue'

import ResearchTimeline from './components/ResearchTimeline'
import UploadResearchContentFileDialog from './components/UploadResearchContentFileDialog';
import ResearchReviewItem from './components/ResearchReviewItem'
import ResearchDetailsMaterials from './components/ResearchDetailsMaterials'
import ResearchDetailsMaterialsItem from './components/ResearchDetailsMaterialsItem'
import ResearchDetailsDraftList from './components/ResearchDetailsDraftList'
import ResearchDetailsDraftListItem from './components/ResearchDetailsDraftListItem'
import ResearchDetailsBody from './components/ResearchDetailsBody'
import ResearchDetailsSidebar from './components/ResearchDetailsSidebar'
import ResearchDetailsHeader from './components/ResearchDetailsHeader'
import ResearchDetailsInvestors from './components/ResearchDetailsInvestors'
import ResearchDetailsECI from './components/ResearchDetailsECI'
import ResearchDetailsReviews from './components/ResearchDetailsReviews'
import ResearchDetailsFundraising from './components/ResearchDetailsFundraising'

Vue.component('upload-research-content-file-dialog', UploadResearchContentFileDialog);
Vue.component('research-review-item', ResearchReviewItem);
Vue.component('research-details-materials', ResearchDetailsMaterials);
Vue.component('research-details-materials-item', ResearchDetailsMaterialsItem);
Vue.component('research-details-draft-list', ResearchDetailsDraftList);
Vue.component('research-details-draft-list-item', ResearchDetailsDraftListItem);
Vue.component('research-details-body', ResearchDetailsBody);
Vue.component('research-details-sidebar', ResearchDetailsSidebar);
Vue.component('research-details-header', ResearchDetailsHeader);
Vue.component('research-details-investors', ResearchDetailsInvestors);
Vue.component('research-details-eci', ResearchDetailsECI)
Vue.component('research-details-reviews', ResearchDetailsReviews)
Vue.component('research-details-fundraising', ResearchDetailsFundraising)
