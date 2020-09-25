export const install = (Vue, options = {}) => {
  const property = options.property || '$confirm';
  delete options.property;
  const { vuetify } = options;
  delete options.vuetify;

  if (!vuetify) {
    console.warn('Module vuetify-confirm needs vuetify instance. Use Vue.use(VuetifyConfirm, { vuetify })');
  }
};

export default install;
