import { store } from '@/store';
import { notificationsStore } from '@/features/Notifications/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  store.registerModule('Notifications', notificationsStore);
};

const NotificationsFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(NotificationsFeature);
}

export default NotificationsFeature;
