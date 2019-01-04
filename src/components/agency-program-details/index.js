import Vue from 'vue';

import AgencyProgramDetails from './AgencyProgramDetails';
import ApplicationListItem from './components/ApplicationListItem';
import UploadApplicationFileDialog from './components/UploadApplicationFileDialog';

Vue.component('agency-program-details', AgencyProgramDetails);
Vue.component('application-list-item', ApplicationListItem);
Vue.component('send-application-dialog', UploadApplicationFileDialog);
