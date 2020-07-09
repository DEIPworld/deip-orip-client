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

  getPendingProjects(context, { username }) {
    return researchService.getPendingResearchApplicationsByResearcher(username)
      .then((result) => {
        context.commit('getPendingProjects', result);
      });
  },
  getRejectedProjects(context, { username }) {
    return researchService.getRejectedResearchApplicationsByResearcher(username)
      .then((result) => {
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
    state.account = account;
  },

  SET_USER_PROFILE(state, profile) {
    state.profile = profile;
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
