import { AccessService } from '@deip/access-service';

const accessService = AccessService.getInstance();

export const contextHelpersMixin = {
  computed: {

    $tenant() { return this.$store.getters['auth/tenant']; },
    $tenantSettings() { return this.$tenant.profile.settings; },

    $hasModule() { return (module) => this.$isUser 
      ? this.$currentUser.profile.modules[module] 
      : this.$tenant.profile.settings.modules[module];
    }
  },
  methods: {
    $hasSlot(name) {
      return !!(this.$slots[name] || this.$scopedSlots[name]);
    }
  }
};
