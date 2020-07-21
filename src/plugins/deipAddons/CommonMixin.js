import { AccessService } from '@deip/access-service';

const accessService = AccessService.getInstance();

export const CommonMixin = {
  data() {
    return {
      $_dataReady: false
    };
  },
  computed: {
    $isLoggedIn() { return accessService.isLoggedIn(); },
    $ready() { return this.$data.$_dataReady; },
    $tenantSettings() { return this.$store.getters['auth/tenant'].profile.settings; }
  },
  methods: {
    $hasSlot(name) {
      return this.$slots[name] !== undefined;
    },
    $setReady(state = true) {
      this.$data.$_dataReady = state;
    }
  }
};
