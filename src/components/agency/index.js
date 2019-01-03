import Vue from 'vue';

import AgencyPrograms from './AgencyPrograms';
import AgencyProgramDetails from './AgencyProgramDetails';

import ProgramListItem from './components/ProgramListItem';

Vue.component('agency-programs', AgencyPrograms);
Vue.component('agency-program-details', AgencyProgramDetails);

Vue.component('program-list-item', ProgramListItem);