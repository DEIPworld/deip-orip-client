import { AccessService } from '@deip/access-service';

const accessService = AccessService.getInstance();

export const deipAddons = {
  install(_Vue) {
    _Vue.mixin({
      data() {
        return {
          $_dataReady: false
        };
      },
      computed: {
        $isUser() { return accessService.isLoggedIn(); },
        $ready() { return this.$data.$_dataReady; }
      },
      methods: {
        $hasSlot(name) {
          return this.$slots[name] !== undefined;
        },
        $setReady(state = true) {
          this.$data.$_dataReady = state;
        }
      }
    });

    _Vue.directive('custom', {
      bind(el, binding, vnode) {
        const map = {
          input: 'text-field'
        };

        // eslint-disable-next-line no-nested-ternary
        const prefix = binding.arg
          ? map[binding.arg]
            ? map[binding.arg]
            : binding.arg
          : vnode.componentOptions.tag;

        el.classList.add(`${prefix}--${binding.value || 'custom'}`);
      }
    });
  }
};
