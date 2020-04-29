import Vue from 'vue';

import Toolbar from './components/Toolbar';
import GlobalLoader from './components/GlobalLoader';
import SidebarSplittedBtn from './components/SidebarSplittedBtn';
import BasePageLayout from './components/BasePageLayout';

import './components/user-notificatons-list/index';

Vue.component('toolbar', Toolbar);
Vue.component('global-loader', GlobalLoader);
Vue.component('sidebar-splitted-btn', SidebarSplittedBtn);
Vue.component('base-page-layout', BasePageLayout);
