import VexWysiwyg from './VexWysiwyg';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  // eslint-disable-next-line no-unused-vars
  install.installed = true;

  Vue.component('VexWysiwyg', VexWysiwyg);
};

const VexWysiwygPlugin = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VexWysiwygPlugin);
}

export default VexWysiwygPlugin;
export { VexWysiwyg };
