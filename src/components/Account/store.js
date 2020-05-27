import deipRpc from '@deip/rpc-client';
import Vue from 'vue';

import { UsersService } from '@deip/users-service';
import { ResearchService } from '@deip/research-service';

const usersService = UsersService.getInstance();
const researchService = ResearchService.getInstance();

const state = {
  account: undefined,
  profile: undefined,
  pendingProjects: [],
  rejectedProjects: [],
  publicProjects: [],
};

// getters
const getters = {
  userInfo: (state, getters) => ({
    account: state.account,
    profile: state.profile
  }),

  pendingProjects: (state) => state.pendingProjects,
  rejectedProjects: (state) => state.rejectedProjects,
  publicProjects: (state) => state.publicProjects
};

// actions
const actions = {

  loadUserAccount({
    state, dispatch, commit, rootGetters
  }, { username }) {
    const accountLoad = new Promise((resolve, reject) => {
      dispatch('loadAccountData', {
        username,
        notify: resolve
      });
    });

    const profileLoad = new Promise((resolve, reject) => {
      dispatch('loadProfileData', {
        username,
        notify: resolve
      });
    });
    return Promise.all([accountLoad, profileLoad]);
  },

  loadAccountData({ commit }, { username, notify } = {}) {
    return deipRpc.api.getAccountsAsync([username])
      .then(([account]) => {
        commit('SET_USER_ACCOUNT', account);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadProfileData({ commit }, { username, notify } = {}) {
    return usersService.getUserProfile(username)
      .then((profile) => {
        commit('SET_USER_PROFILE', profile || null);
      }, (err) => {
        console.log(err);
      }).finally(() => {
        if (notify) notify();
      });
  },

  getPendingProjects(context, { username }) {
    return researchService.getPendingResearchApplicationsByResearcher(username)
      .then((result) => {
        console.log(username,result)
        context.commit('getPendingProjects', result);
      });
  },
  getRejectedProjects(context, { username }) {
    return researchService.getRejectedResearchApplicationsByResearcher(username)
      .then((result) => {
        console.log(username,result)
        context.commit('getRejectedProjects', result);
      });
  },
  getAllProjects(context, { username }) {
    return Promise.all([
      context.dispatch('getPendingProjects', { username }),
      context.dispatch('getRejectedProjects', { username })
    ]);
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

  getPendingProjects(state, payload) {
    state.pendingProjects = payload;
  },
  getRejectedProjects(state, payload) {
    state.rejectedProjects = payload;
  }
};

const namespaced = true;

export const accountStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
