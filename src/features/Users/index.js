import { store } from '@/store';
import { usersStore } from '@/features/Users/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  // eslint-disable-next-line no-unused-vars
  install.installed = true;

  store.registerModule('Users', usersStore);
};

const UsersFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(UsersFeature);
}

export default UsersFeature;
