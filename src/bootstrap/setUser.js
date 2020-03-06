import { AccessService } from '@deip/access-service';
import { store } from '@/store';

const setUser = async () => {
  if (AccessService.getInstance().isLoggedIn()) {
    await store.dispatch('auth/loadUser');
  }
};

export {
  setUser
};
