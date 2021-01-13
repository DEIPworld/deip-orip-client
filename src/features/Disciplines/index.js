import { store } from '@/store';
import { disciplinesStore } from '@/features/Disciplines/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;

  install.installed = true;

  store.registerModule('Disciplines', disciplinesStore);
};

const DisciplinesFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(DisciplinesFeature);
}

export default DisciplinesFeature;
