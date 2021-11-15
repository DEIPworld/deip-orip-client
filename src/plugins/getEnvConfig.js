import axios from 'axios';
import { AppConfigService } from '@deip/app-config-service';

export const getEnvConfig = () => {
  const promise = axios.get('/env')
    .then((res) => {
      const env = res.data;
      AppConfigService.getInstance().init({ env });
      window.env = res.data; // TODO: temp solution
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
