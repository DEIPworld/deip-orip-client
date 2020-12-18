import { store } from '@/store';
import { authStore } from '@/features/Auth/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;

  install.installed = true;

  store.registerModule('Auth', authStore);

  Vue.mixin({
    computed: {
      $isUser() { return this.$store.getters['Auth/isUser']; },
      $isGuest() { return !this.$isUser; },
      $currentUser() { return this.$store.getters['Auth/currentUser']; }
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
