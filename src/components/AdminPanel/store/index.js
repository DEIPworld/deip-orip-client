import Vue from 'vue';
import deipRpc from '@deip/rpc-client';

import { UsersService } from '@deip/users-service';
import { TenantService } from '@deip/tenant-service';

const usersService = UsersService.getInstance();
const tenantService = TenantService.getInstance();

const state = {
  registeredMembers: [],
  waitingMembers: []
};

// getters
const getters = {
  registeredMembers: (state) => state.registeredMembers,
  waitingMembers: (state) => state.waitingMembers,
  faqs: (state, getters, rootState, rootGetters) => rootGetters['auth/tenant'].profile.settings.faq,
  researchComponents: (state, getters, rootState, rootGetters) => rootGetters['auth/tenant'].profile.settings.researchComponents
};

// actions
const actions = {
  loadAdminPanel({ state, dispatch }) {
    const registeredMembersLoad = new Promise((resolve, reject) => {
      dispatch('loadRegisteredMembers', { notify: resolve });
    });
    const waitingMembersLoad = new Promise((resolve, reject) => {
      dispatch('loadWaitingMembers', { notify: resolve });
    });

    return Promise.all([registeredMembersLoad, waitingMembersLoad]);
  },

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
        if (notify) notify()
      });
  }
};

// mutations
const mutations = {
  SET_REGISTERED_MEMBERS(state, list) {
    Vue.set(state, 'registeredMembers', list);
  },
  SET_WAITING_MEMBERS(state, list) {
    Vue.set(state, 'waitingMembers', list);
  },
};

const namespaced = true;

export const adminPanelStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
