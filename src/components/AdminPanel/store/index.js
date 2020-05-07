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
  faqs: (state, getters, rootState, rootGetters) => rootGetters['auth/tenant'].profile.settings.faq
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
    return deipRpc.api.getAllAccountsAsync()
      .then((accounts) => usersService.getEnrichedProfiles(accounts.map((a) => a.name)), (err) => { console.error(err); })
      .then((users) => {
        const approvedUsers = users.filter(u => u.profile && u.profile.status == "approved");
        commit('SET_REGISTERED_MEMBERS', approvedUsers);
      })
      .catch((err) => { console.log(err); })
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
