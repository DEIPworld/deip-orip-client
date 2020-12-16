import { store } from '@/store';
import { authStore } from '@/features/Auth/store';
import { AccessService } from '@deip/access-service';

const accessService = AccessService.getInstance();

const install = (Vue, options = {}) => {
  if (install.installed) return;

  install.installed = true;

  store.registerModule('Auth', authStore);

  Vue.mixin({
    computed: {
      $isLoggedIn() { return accessService.isLoggedIn(); },

      $currentUser() { return this.$isLoggedIn ? this.$store.getters['Auth/currentUser'] : false; },
      $currentUserName() { return this.$isLoggedIn ? this.$currentUser.username : false; },
    }
  });
};

const AuthFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(AuthFeature);
}

export default AuthFeature;
