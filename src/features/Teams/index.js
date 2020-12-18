import { store } from '@/store';
import { teamsStore } from '@/features/Teams/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  store.registerModule('Teams', teamsStore);
};

const TeamsFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(TeamsFeature);
}

export default TeamsFeature;
