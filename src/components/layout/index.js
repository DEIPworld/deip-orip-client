import Vue from 'vue';

import Toolbar from './components/Toolbar';
import GlobalLoader from './components/GlobalLoader';
import Sidebar from './components/Sidebar';
import Contentbar from './components/Contentbar';
import PageContainer from './components/PageContainer';
import SidebarSplittedBtn from './components/SidebarSplittedBtn';
import BasePageLayout from './components/BasePageLayout';

Vue.component('toolbar', Toolbar);
Vue.component('global-loader', GlobalLoader);
Vue.component('sidebar', Sidebar);
Vue.component('contentbar', Contentbar);
Vue.component('page-container', PageContainer);
Vue.component('sidebar-splitted-btn', SidebarSplittedBtn);
Vue.component('base-page-layout', BasePageLayout);

import './components/user-notificatons-list/index';