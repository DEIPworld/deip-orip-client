import deipRpc from '@deip/rpc-client';
import { AppConfigService } from '@deip/app-config-service';

const setDeipRpc = () => {
  const env = AppConfigService.getInstance().get('env');
  deipRpc.api.setOptions({
    url: env.DEIP_FULL_NODE_URL,
    reconnectTimeout: 3000
  });

  deipRpc.config.set('chain_id', env.CHAIN_ID);
};

export {
  setDeipRpc
}
