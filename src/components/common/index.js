import Vue from 'vue';

// components

import ConfirmActionDialog from './components/ConfirmActionDialog';

import DatetimePicker from './components/DatetimePicker';

import SidebarLoader from './components/SidebarLoader';

import DisciplineTreePicker from './disciplines/components/DisciplineTreePicker';

import DisciplineTreeItem from './disciplines/components/DisciplineTreeItem';

import AdvancedDisciplinePicker from './disciplines/components/AdvancedDisciplinePicker';

import PlatformAvatar from './components/PlatformAvatar';

import UserAutocompletePicker from './components/UserAutocompletePicker';
// filters

import ToggleText from './components/ToggleText';

import MilestoneStepper from './components/research/milestone-stepper/MilestoneStepper';
import Milestone from './components/research/milestone-stepper/Milestone';

import TopResearchLabel from './components/research/TopResearchLabel';


import TechnologyReadinessLevel from './components/research/technology-readiness-level/TechnologyReadinessLevel';

import ResearchPartners from './components/research/research-partners/ResearchPartners';

import './filters/index';

Vue.component('confirm-action-dialog', ConfirmActionDialog);
Vue.component('datetime-picker', DatetimePicker);
Vue.component('sidebar-loader', SidebarLoader);
Vue.component('discipline-tree-picker', DisciplineTreePicker);
Vue.component('discipline-tree-item', DisciplineTreeItem);
Vue.component('advanced-discipline-picker', AdvancedDisciplinePicker);
Vue.component('platform-avatar', PlatformAvatar);
Vue.component('user-autocomplete-picker', UserAutocompletePicker);
Vue.component('toggle-text', ToggleText);
Vue.component('milestone-stepper', MilestoneStepper);
Vue.component('milestone', Milestone);
Vue.component('top-research-label', TopResearchLabel);
Vue.component('technology-readiness-level', TechnologyReadinessLevel);
Vue.component('research-partners', ResearchPartners);
