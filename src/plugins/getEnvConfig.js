import axios from 'axios';
import { AppConfigService } from '@deip/app-config-service';
import deipRpc from '@deip/rpc-client';

export const getEnvConfig = () => {
  const promise = axios.get('/env')
    .then((res) => {
      const env = res.data;

      AppConfigService.getInstance().init({ env });
      window.env = res.data; // TODO: temp solution

      deipRpc.api.setOptions({
        url: env.DEIP_FULL_NODE_URL,
        reconnectTimeout: 3000
      });

      deipRpc.config.set('chain_id', env.CHAIN_ID);

      return env;
    })
    .then((data) => ({
      install(Vue) {
        Vue.prototype.$env = data;
        Vue.$env = data;
      }
    }));
  return promise;
};
