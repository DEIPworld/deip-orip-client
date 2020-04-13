import Vue from 'vue'

import DisciplineGrantPickDiscipline from './components/DisciplineGrantPickDiscipline';
import DisciplineGrantAmount from './components/DisciplineGrantAmount';
import DisciplineGrantConditions from './components/DisciplineGrantConditions';

Vue.component('discipline-grant-pick-discipline', DisciplineGrantPickDiscipline);
Vue.component('discipline-grant-amount', DisciplineGrantAmount);
Vue.component('discipline-grant-conditions', DisciplineGrantConditions);

import DirectGrantPickResearch from './components/DirectGrantPickResearch';
import DirectGrantAmount from './components/DirectGrantAmount';
import DirectGrantConditions from './components/DirectGrantConditions';

Vue.component('direct-grant-pick-research', DirectGrantPickResearch);
Vue.component('direct-grant-amount', DirectGrantAmount);
Vue.component('direct-grant-conditions', DirectGrantConditions);
