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

// filters

import './filters/index';
