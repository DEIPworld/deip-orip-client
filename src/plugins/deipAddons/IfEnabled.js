import { store } from '@/store';

const IfEnabledComponent = {
  name: 'IfEnabled',
  props: {
    module: {
      type: String,
      default: null
    }
  },
  computed: {
    moduleEnable() {
      return this.module
        ? this.$tenantSettings.modules[this.module] !== false
        : true;
    },

    allowRender() {
      return this.moduleEnable;
    }
  },
  render() {
    return this.allowRender ? this.$slots.default : false;
  }
};

const enabledModule = (module) => module ? store.getters['auth/tenant'].profile.settings.modules[module] !== false : true;


export {
  IfEnabledComponent,
  enabledModule
};
