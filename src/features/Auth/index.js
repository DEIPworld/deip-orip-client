import { store } from '@/store';
import { authStore } from '@/features/Auth/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  // eslint-disable-next-line no-unused-vars
  install.installed = true;

  store.registerModule('Auth', authStore);
};

const AuthFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(AuthFeature);
}

export default AuthFeature;
