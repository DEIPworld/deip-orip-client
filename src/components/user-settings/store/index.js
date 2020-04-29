import deipRpc from '@deip/rpc-client';
import Vue from 'vue';

import { UsersService } from '@deip/users-service';

const usersService = UsersService.getInstance();

const state = {
  account: undefined,
  profile: undefined,

  isLoadingUserAccount: false,
  isLoadingUserProfile: false
};

// getters
const getters = {
  userInfo: (state, getters) => ({
    account: state.account,
    profile: state.profile
  }),

  isLoadingUserAccount: (state) => state.isLoadingUserAccount,
  isLoadingUserProfile: (state) => state.isLoadingUserProfile
};

// actions
const actions = {

  loadUserSettingsPage({
    state, dispatch, commit, rootGetters
  }, { username }) {
    const currentUser = rootGetters['auth/user'];
    const isMyPage = currentUser.username == username;

    const accountLoad = new Promise((resolve, reject) => {
      dispatch('loadUserAccount', {
        username,
        notify: resolve
      });
    });
    const profileLoad = new Promise((resolve, reject) => {
      dispatch('loadUserProfile', {
        username,
        notify: resolve
      });
    });
    return Promise.all([accountLoad, profileLoad]);
  },
  loadUserAccount({ commit }, { username, notify } = {}) {
    commit('SET_USER_ACCOUNT_LOADING_STATE', true);

    return deipRpc.api.getAccountsAsync([username])
      .then(([account]) => {
        commit('SET_USER_ACCOUNT', account);
      })
      .finally(() => {
        commit('SET_USER_ACCOUNT_LOADING_STATE', false);
        if (notify) notify();
      });
  },
  loadUserProfile({ commit }, { username, notify } = {}) {
    commit('SET_USER_PROFILE_LOADING_STATE', true);
    return usersService.getUserProfile(username)
      .then((profile) => {
        commit('SET_USER_PROFILE', profile || null);
      }, (err) => {
        console.log(err);
      }).finally(() => {
        commit('SET_USER_PROFILE_LOADING_STATE', false);
        if (notify) notify();
      });
  }
};

// mutations
const mutations = {
  SET_USER_ACCOUNT(state, account) {
    Vue.set(state, 'account', account);
  },

  SET_USER_PROFILE(state, profile) {
    Vue.set(state, 'profile', profile);
  },

  SET_USER_ACCOUNT_LOADING_STATE(state, value) {
    state.isLoadingUserAccount = value;
  },

  SET_USER_PROFILE_LOADING_STATE(state, value) {
    state.isLoadingUserProfile = value;
  }
};

const namespaced = true;

export const userSettingsStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
