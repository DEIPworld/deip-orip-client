import { store } from '@/store';
import { contentsStore } from '@/features/Contents/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  // eslint-disable-next-line no-unused-vars
  install.installed = true;

  store.registerModule('Contents', contentsStore);
};

const ContentsFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ContentsFeature);
}

export default ContentsFeature;
