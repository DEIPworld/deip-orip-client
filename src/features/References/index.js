import { store } from '@/store';
import { referencesStore } from '@/features/References/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  // eslint-disable-next-line no-unused-vars
  install.installed = true;

  store.registerModule('References', referencesStore);
};

const ReferencesFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ReferencesFeature);
}

export default ReferencesFeature;
