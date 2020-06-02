import _ from 'lodash';
import Vue from 'vue';


const state = {
  success: { isVisible: false, message: '' },
  error: { isVisible: false, message: '' },
  globalLoader: { isLoading: false },
  themeSettings: null
};

// getters
const getters = {
  success: (state, getters) => state.success,
  error: (state, getters) => state.error,
  globalLoader: (state, getters) => state.globalLoader,
  themeSettings: (state, getters) => state.themeSettings
};

// actions
const actions = {

  setGlobalLoader({ state, commit }) {
    commit('CHANGE_GLOBAL_LOADER_FIELD', { field: 'isLoading', value: true });
  },

  hideGlobalLoader({ state, commit }) {
    commit('CHANGE_GLOBAL_LOADER_FIELD', { field: 'isLoading', value: false });
  },

  setGlobalThemeSettings({ state, commit }, themeSettings) {
    commit('SET_GLOBAL_THEME_SETTINGS', themeSettings);
  }
};

// mutations
const mutations = {

  CHANGE_GLOBAL_LOADER_FIELD(state, payload) {
    Vue.set(state.globalLoader, payload.field, payload.value);
  },

  SET_GLOBAL_THEME_SETTINGS(state, themeSettings) {
    Vue.set(state, 'themeSettings', themeSettings);
  }
};

const namespaced = true;

export const layoutStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
