import Vue from 'vue';

// components

import ConfirmActionDialog from './components/ConfirmActionDialog';

import DatetimePicker from './components/DatetimePicker';

import SidebarLoader from './components/SidebarLoader';

import DomainTreePicker from './disciplines/components/DisciplineTreePicker';

import DomainTreeItem from './disciplines/components/DisciplineTreeItem';

import AdvancedDomainPicker from './disciplines/components/AdvancedDisciplinePicker';

import PlatformAvatar from './components/PlatformAvatar';

import UserAutocompletePicker from './components/UserAutocompletePicker';
// filters

import ToggleText from './components/ToggleText';

import MilestoneStepper from './components/research/milestone-stepper/MilestoneStepper';
import Milestone from './components/research/milestone-stepper/Milestone';

import TopProjectLabel from './components/research/TopResearchLabel';


import TechnologyReadinessLevel from './components/research/technology-readiness-level/TechnologyReadinessLevel';

import ProjectPartners from './components/research/research-partners/ResearchPartners';

import './filters/index';

Vue.component('confirm-action-dialog', ConfirmActionDialog);
Vue.component('datetime-picker', DatetimePicker);
Vue.component('sidebar-loader', SidebarLoader);
Vue.component('domain-tree-picker', DomainTreePicker);
Vue.component('domain-tree-item', DomainTreeItem);
Vue.component('advanced-domain-picker', AdvancedDomainPicker);
Vue.component('platform-avatar', PlatformAvatar);
Vue.component('user-autocomplete-picker', UserAutocompletePicker);
Vue.component('toggle-text', ToggleText);
Vue.component('milestone-stepper', MilestoneStepper);
Vue.component('milestone', Milestone);
Vue.component('top-project-label', TopProjectLabel);
Vue.component('technology-readiness-level', TechnologyReadinessLevel);
Vue.component('project-partners', ProjectPartners);
