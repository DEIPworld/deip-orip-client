import Vue from 'vue';
import deipRpc from '@deip/rpc-client';

import { UsersService } from '@deip/users-service';
import { TenantService } from '@deip/tenant-service';
import { ResearchService } from '@deip/research-service';

const usersService = UsersService.getInstance();
const tenantService = TenantService.getInstance();
const researchService = ResearchService.getInstance();

const state = {
  registeredMembers: [],
  waitingMembers: [],
  pendingProjects: [],
  publicProjects: []
};

// getters
const getters = {
  registeredMembers: (state) => state.registeredMembers,
  waitingMembers: (state) => state.waitingMembers,

  faqs: (state, getters, rootState, rootGetters) => rootGetters['auth/tenant'].profile.settings.faq,

  categories: (state, getters, rootState, rootGetters) => rootGetters['auth/tenant'].profile.settings.researchCategories,

  researchComponents: (state, getters, rootState, rootGetters) => rootGetters['auth/tenant'].profile.settings.researchComponents,

  pendingProjects: (state) => state.pendingProjects,
  publicProjects: (state) => state.publicProjects
};

// actions
const actions = {
  loadRegisteredMembers({ commit }, { notify } = {}) {
    return usersService.getActiveUsers()
      .then((users) => {
        const approvedUsers = users.sort((a, b) => {
          const dateA = new Date(a.profile.created_at);
          const dateB = new Date(b.profile.created_at);
          return dateB - dateA;
        });
        commit('SET_REGISTERED_MEMBERS', approvedUsers);
      })
      .catch((err) => { console.error(err); })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadWaitingMembers({ commit }, { notify } = {}) {
    return tenantService.getSignUpRequests()
      .then((users) => {
        commit('SET_WAITING_MEMBERS', users);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (notify) notify();
      });
  },

  loadAllMembers({ state, dispatch }) {
    const registeredMembersLoad = new Promise((resolve, reject) => {
      dispatch('loadRegisteredMembers', { notify: resolve });
    });
    const waitingMembersLoad = new Promise((resolve, reject) => {
      dispatch('loadWaitingMembers', { notify: resolve });
    });

    return Promise.all([registeredMembersLoad, waitingMembersLoad]);
  },

  // =====================

  getPendingProjects(context) {
    return researchService.getPendingResearchApplications()
      .then((result) => {
        context.commit('getPendingProjects', result);
      });
  },

  getPublicProjects(context) {
    return researchService.getPublicResearchListing()
      .then((result) => {
        context.commit('getPublicProjects', result);
      });
  },

  getAllProjects(context) {
    return Promise.all([
      context.dispatch('getPendingProjects'),
      context.dispatch('getPublicProjects')
    ]);
  }
};

// mutations
const mutations = {
  SET_REGISTERED_MEMBERS(state, list) {
    state.registeredMembers = list;
  },
  SET_WAITING_MEMBERS(state, list) {
    state.waitingMembers = list;
  },

  //= ==============

  getPendingProjects(state, payload) {
    state.pendingProjects = payload;
  },

  getPublicProjects(state, payload) {
    state.publicProjects = payload;
  }
};

const namespaced = true;

export const adminPanelStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
