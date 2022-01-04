import { AccessService } from '@deip/access-service';

const accessService = AccessService.getInstance();

export const contextHelpersMixin = {
  computed: {

    $portal() { return this.$store.getters['auth/portal']; },
    $portalSettings() { return this.$portal.profile.settings; },

    $hasModule() { return (module) => this.$isUser 
      ? this.$currentUser.profile.modules[module] 
      : this.$portal.profile.settings.modules[module];
    }
  },
  methods: {
    $hasSlot(name) {
      return !!(this.$slots[name] || this.$scopedSlots[name]);
    }
  }
};
