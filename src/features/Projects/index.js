import { store } from '@/store';
import { projectsStore } from '@/features/Projects/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  // eslint-disable-next-line no-unused-vars
  install.installed = true;

  store.registerModule('Projects', projectsStore);
};

const ProjectsFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ProjectsFeature);
}

export default ProjectsFeature;
