import { AccessService } from '@deip/access-service';

const accessService = AccessService.getInstance();

export const contextHelpersMixin = {
  computed: {
    $isLoggedIn() { return accessService.isLoggedIn(); },
  },
  methods: {
    $hasSlot(name) {
      return !!this.$slots[name] || !!this.$scopedSlots[name];
    }
  }
};
