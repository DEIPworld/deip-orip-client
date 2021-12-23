import Vue from 'vue';
import { UserService } from '@deip/user-service';
import { PortalService } from '@deip/portal-service';

const userService = UserService.getInstance();
const portalService = PortalService.getInstance();

const state = {
  registeredMembers: [],
  waitingMembers: [],
};

// getters
const getters = {
  registeredMembers: (state) => state.registeredMembers,
  waitingMembers: (state) => state.waitingMembers,

  faqs: (state, getters, rootState, rootGetters) => rootGetters['auth/portal'].profile.settings.faq,

  categories: (state, getters, rootState, rootGetters) => rootGetters['auth/portal'].profile.settings.projectCategories
};

// actions
const actions = {
  loadRegisteredMembers({ commit }, { notify } = {}) {
    return userService.getUsersByPortal(Vue.$env.TENANT)
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
    return portalService.getSignUpRequests()
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
};

// mutations
const mutations = {
  SET_REGISTERED_MEMBERS(state, list) {
    state.registeredMembers = list;
  },
  SET_WAITING_MEMBERS(state, list) {
    state.waitingMembers = list;
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
