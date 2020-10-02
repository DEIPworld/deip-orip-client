import { AccessService } from '@deip/access-service';

const accessService = AccessService.getInstance();

export const contextHelpersMixin = {
  computed: {
    $isLoggedIn() { return accessService.isLoggedIn(); },

    $currentUser() { return this.$isLoggedIn ? this.$store.getters['auth/user'] : false; },
    $currentUserName() { return this.$isLoggedIn ? this.$currentUser.account.name : false; },

    $tenant() { return this.$store.getters['auth/tenant']; },
    $tenantSettings() { return this.$tenant.profile.settings; },

    isUser() { return this.$isLoggedIn; },
    isGuest() { return !this.$isLoggedIn; }
  },
  methods: {
    $hasSlot(name) {
      return !!this.$slots[name] || !!this.$scopedSlots[name];
    }
  }
};
