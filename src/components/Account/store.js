import deipRpc from '@deip/rpc-client';

import { UsersService } from '@deip/users-service';

const usersService = UsersService.getInstance();

const state = {
  account: undefined,
  profile: undefined,
};

// getters
const getters = {
  userInfo: (state, getters) => ({
    account: state.account,
    profile: state.profile
  }),
};

// actions
const actions = {

  loadUserAccount({
    state, dispatch
  }, { username }) {
    return Promise.all([
      dispatch('loadAccountData', { username }),
      dispatch('loadProfileData', { username })
    ]);
  },

  loadAccountData({ commit }, { username } = {}) {
    return deipRpc.api.getAccountsAsync([username])
      .then(([account]) => {
        commit('SET_USER_ACCOUNT', account);
      });
  },

  loadProfileData({ commit }, { username } = {}) {
    return usersService.getUserProfile(username)
      .then((profile) => {
        commit('SET_USER_PROFILE', profile || null);
      }, (err) => {
        console.error(err);
      });
  },
};

// mutations
const mutations = {
  SET_USER_ACCOUNT(state, account) {
    state.account = account;
  },

  SET_USER_PROFILE(state, profile) {
    state.profile = profile;
  },
};

const namespaced = true;

export const accountStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
