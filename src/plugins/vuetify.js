import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { i18n } from '@/plugins/i18n';

Vue.use(Vuetify);

const opts = {
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  },
  theme: {
    options: {
      customProperties: true
    }
  }
};

export const vuetify = new Vuetify(opts);
