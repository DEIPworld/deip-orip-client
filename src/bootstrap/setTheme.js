import Vue from 'vue';
import Vuetify from 'vuetify';
import themes from '@/theme';
import { store } from '@/store';

import { AppConfigService } from '@deip/app-config-service';

const setTheme = async () => {
  const env = AppConfigService.getInstance().get('env');
  const tenant = env.TENANT || null;

  const themeSettings = tenant && themes[tenant]
    ? themes[tenant]
    : themes.default;

  if (tenant) {
    if (tenant === 'nsf') {
      document.title = 'MyNSF | DEIP';
    } else if (tenant === 'mit') {
      document.title = 'MIT | DEIP';
    } else if (tenant === 'treasury') {
      document.title = 'U.S. Treasury | DEIP';
    }
  }

  // TODO: extract to plugin
  Vue.use(Vuetify, {
    theme: {
      primary: themeSettings['primary-color'],
      secondary: themeSettings['secondary-color']
    },
    options: {
      customProperties: true
    }
  });

  await store.dispatch('layout/setGlobalThemeSettings', themeSettings);
};

export {
  setTheme
}
