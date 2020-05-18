import { AccessService } from '@deip/access-service';

const accessService = AccessService.getInstance();

export const CommonMixin = {
  computed: {
    $isUser() { return accessService.isLoggedIn(); }
  },
  methods: {
    $hasSlot(name) {
      return this.$slots[name] !== undefined;
    }
  }
};
