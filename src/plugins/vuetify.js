import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const opts = {
  theme: {
    options: {
      customProperties: true
    }
  }
};

export const vuetify = new Vuetify(opts);
