import { store } from '@/store';

export const ifEnabled = {
  install(_Vue) {
    const ifEnableFn = (q) => {
      const checkingMap = {
        module: () => store.getters['auth/tenant'].profile.settings.modules[q.module] === true
      };

      const checkingResult = [];

      for (const key of Object.keys(q)) {
        if (checkingMap[key]) {
          checkingResult.push(checkingMap[key]());
        }
      }

      return checkingResult.every((x) => x === true);
    };

    _Vue.prototype.$ifEnabled = ifEnableFn;
    _Vue.$ifEnabled = ifEnableFn;

    _Vue.component('IfEnabled', {
      props: {
        module: {
          type: String,
          default: null
        }
      },
      computed: {
        allowRender() {
          return this.$ifEnabled({
            ...(this.module ? { module: this.module } : {})
          });
        }
      },
      render() {
        return this.allowRender ? this.$slots.default : false;
      }
    });
  }
};
