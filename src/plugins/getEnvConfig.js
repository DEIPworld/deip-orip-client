import axios from 'axios';
import { AppConfigService } from '@deip/app-config-service';

export const getEnvConfig = () => {
  const promise = axios.get('/env')
    .then((res) => {
      AppConfigService.getInstance().init({ env: res.data });
      window.env = res.data; // TODO: temp solution

      return res.data;
    })
    .then((data) => ({
      install(_Vue) {
        // eslint-disable-next-line no-param-reassign
        _Vue.prototype.$env = data;
        // eslint-disable-next-line no-param-reassign
        _Vue.$env = data;
      }
    }));
  return promise;
};
