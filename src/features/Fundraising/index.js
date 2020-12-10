import { store } from '@/store';
import { fundraisingStore } from '@/features/Fundraising/store/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  // eslint-disable-next-line no-unused-vars
  install.installed = true;

  store.registerModule('Fundraising', fundraisingStore);
};

const FundraisingFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(FundraisingFeature);
}

export default FundraisingFeature;
