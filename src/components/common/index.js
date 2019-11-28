import Vue from 'vue';

// components

import StateResearchList from './research/components/StateResearchList';
Vue.component('state-research-list', StateResearchList);

import ConfirmActionDialog from './components/ConfirmActionDialog';
Vue.component('confirm-action-dialog', ConfirmActionDialog);

import DatetimePicker from './components/DatetimePicker';
Vue.component('datetime-picker', DatetimePicker);

import SidebarLoader from './components/SidebarLoader';
Vue.component('sidebar-loader', SidebarLoader);

import DisciplineTreePicker from './disciplines/components/DisciplineTreePicker';
Vue.component('discipline-tree-picker', DisciplineTreePicker);

import DisciplineTreeItem from './disciplines/components/DisciplineTreeItem';
Vue.component('discipline-tree-item', DisciplineTreeItem);

import AdvancedDisciplinePicker from './disciplines/components/AdvancedDisciplinePicker';
Vue.component('advanced-discipline-picker', AdvancedDisciplinePicker);

import InternalReferencesPicker from './components/InternalReferencesPicker';
Vue.component('internal-references-picker', InternalReferencesPicker);

import PlatformAvatar from './components/PlatformAvatar';
Vue.component('platform-avatar', PlatformAvatar);

import UserAutocompletePicker from './components/UserAutocompletePicker';
Vue.component('user-autocomplete-picker', UserAutocompletePicker);
// filters

import SquaredRating from './components/SquaredRating';
Vue.component('squared-rating', SquaredRating);

import ToggleText from './components/ToggleText';
Vue.component('toggle-text', ToggleText);

import MilestoneStepper from './components/milestone-stepper/MilestoneStepper';
import Milestone from './components/milestone-stepper/Milestone';
Vue.component('milestone-stepper', MilestoneStepper);
Vue.component('milestone', Milestone);

import ResearchProjectTile from './research/components/ResearchProjectTile';
Vue.component('research-project-tile', ResearchProjectTile);

import TopResearchLabel from './research/components/TopResearchLabel';
Vue.component('top-research-label', TopResearchLabel);

import './filters/index';
