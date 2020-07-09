import Vue from 'vue';
import deepmerge from 'deepmerge';
import defaultTheme from '../defaultTheme.json';

const state = {
  success: { isVisible: false, message: '' },
  error: { isVisible: false, message: '' },
  globalLoader: { isLoading: false },
  themeSettings: defaultTheme
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

  setGlobalThemeSettings(context, themeSettings) {
    context.commit('SET_GLOBAL_THEME_SETTINGS', themeSettings);
  }
};

// mutations
const mutations = {

  CHANGE_GLOBAL_LOADER_FIELD(state, payload) {
    state.globalLoader[payload.field] = payload.value;
  },

  SET_GLOBAL_THEME_SETTINGS(state, themeSettings) {
    state.themeSettings = deepmerge(state.themeSettings, themeSettings || {});
  }
};

export const layoutStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
