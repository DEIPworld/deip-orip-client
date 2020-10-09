import VeDialog from './VeDialog';

const Install = (Vue, options = {}) => {
  const property = options.property || '$confirm';
  const { vuetify } = options;

  Vue.delete(options, 'property');
  Vue.delete(options, 'vuetify');

  if (!vuetify) {
    console.warn('Module ve-confirm needs vuetify instance. Use Vue.use(VuetifyConfirm, { vuetify })');
  }

  const Ctor = Vue.extend({ vuetify, ...VeDialog });

  function createDialogCmp(opts) {
    const container = document.querySelector('[data-app=true]') || document.body;

    return new Promise((resolve) => {
      const cmp = new Ctor({
        propsData: { ...Vue.prototype[property].options, ...opts },
        destroyed: () => {
          container.removeChild(cmp.$el);
          resolve(cmp.value);
        }
      });
      container.appendChild(cmp.$mount().$el);
    });
  }

  function show(message, opts = {}) {
    const o = {
      ...opts,
      ...{
        message,
        value: true,
        confirm: true
      }
    };
    return createDialogCmp(o);
  }

  Vue.prototype[property] = show;
  Vue.prototype[property].options = options || {};

  Vue.component('VeDialog', { vuetify, ...VeDialog });
};

// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(Install);
// }

export default Install;
