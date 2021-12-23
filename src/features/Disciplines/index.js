import { store } from '@/store';
import { domainsStore } from '@/features/Disciplines/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;

  install.installed = true;

  store.registerModule('Domains', domainsStore);
};

const DomainsFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(DomainsFeature);
}

export default DomainsFeature;
