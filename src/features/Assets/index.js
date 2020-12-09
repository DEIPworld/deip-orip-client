import { store } from '@/store';
import { assetsStore } from '@/features/Assets/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  // eslint-disable-next-line no-unused-vars
  install.installed = true;

  store.registerModule('Assets', assetsStore);
};

const AssetsFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(AssetsFeature);
}

export default AssetsFeature;
