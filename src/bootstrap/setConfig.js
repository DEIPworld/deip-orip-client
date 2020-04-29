import axios from 'axios';

import { AppConfigService } from '@deip/app-config-service';

const setConfig = async () => {
  const env = await axios.get('/env');

  window.env = env.data;

  AppConfigService.getInstance().init({ env: env.data });
};

export {
  setConfig
};
