import VexDialogPlugin from '@/plugins/VuetifyExtended/components/VexDialog';
import VexWysiwygPlugin from '@/plugins/VuetifyExtended/components/VexWysiwyg';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  // eslint-disable-next-line no-unused-vars
  install.installed = true;

  const { vuetify } = options;
  Vue.delete(options, 'vuetify');

  Vue.use(VexDialogPlugin, { vuetify, ...(options.dialog || {}) });
  Vue.use(VexWysiwygPlugin);
};

const VuetifyExtended = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VuetifyExtended);
}

export default VuetifyExtended;
