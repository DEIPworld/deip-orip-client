import { store } from '@/store';
import { AppConfigService } from '@deip/app-config-service';

const setTenant = async () => {
  const env = AppConfigService.getInstance().get('env');

  const tenant = env.TENANT || null;
  if (tenant) {
    await store.dispatch('auth/loadTenant', { tenant });
  }
};

export {
  setTenant
};
