import { AccessService } from '@deip/access-service';
import { mapGetters } from 'vuex';

const accessService = AccessService.getInstance();

export const CommonMixin = {
  computed: {
    $isUser() { return accessService.isLoggedIn(); },

    ...mapGetters({
      $themeSettings: 'layout/themeSettings'
    })
  },
  methods: {
    $hasSlot(name) {
      return this.$slots[name] !== undefined;
    }
  }
};
