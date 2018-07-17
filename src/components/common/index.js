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

// filters

import './filters/index';
