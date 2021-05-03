import { store } from '@/store';
import { invitesStore } from '@/features/Invites/store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  store.registerModule('Invites', invitesStore);
};

const InvitesFeature = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(InvitesFeature);
}

export default InvitesFeature;
