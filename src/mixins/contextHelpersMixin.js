import { AccessService } from '@deip/access-service';

const accessService = AccessService.getInstance();

export const contextHelpersMixin = {
  computed: {
    $isLoggedIn() { return accessService.isLoggedIn(); },

    $currentUser() { return this.$store.getters['auth/user']; },
    $currentUserName() { return this.$currentUser.account.name; },

    $tenant() { return this.$store.getters['auth/tenant']; },
    $tenantSettings() { return this.$tenant.profile.settings; }
  },
  methods: {
    $hasSlot(name) {
      return !!this.$slots[name] || !!this.$scopedSlots[name];
    }
  }
};
