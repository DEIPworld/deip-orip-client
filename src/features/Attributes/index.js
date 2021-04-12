import { store } from '@/store';
import { attributesStore } from '@/features/Attributes/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;

  install.installed = true;

  store.registerModule('Attributes', attributesStore);
};

const AttributesFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(AttributesFeature);
}

export default AttributesFeature;
