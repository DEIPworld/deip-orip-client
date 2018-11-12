import Vue from 'vue';

import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import Contentbar from './components/Contentbar';
import PageContainer from './components/PageContainer';
import SidebarSplittedBtn from './components/SidebarSplittedBtn';
import NotificationsList from './components/NotificationsList';

Vue.component('toolbar', Toolbar);
Vue.component('sidebar', Sidebar);
Vue.component('contentbar', Contentbar);
Vue.component('page-container', PageContainer);
Vue.component('sidebar-splitted-btn', SidebarSplittedBtn);
Vue.component('notifications-list', NotificationsList);