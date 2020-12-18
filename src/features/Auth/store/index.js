import { AccessService } from '@deip/access-service';

const accessService = AccessService.getInstance();

const STATE = {
  loaded: false,
  currentUsername: null
};

const GETTERS = {
  currentUser: (state, getters, rootState, rootGetters) => {
    if (accessService.isLoggedIn()) {
      const { account, profile, teams } = rootGetters['Users/one'](state.currentUsername);
      const balances = rootGetters['Assets/currentUserBalances'];
      const notifications = rootGetters['Notifications/list'];
      const bookmarks = rootGetters['Bookmarks/list'];

      return {
        username: state.currentUsername,
        pubKey: account.memo_key,
        privKey: accessService.getOwnerWif(),
        account,
        profile,
        balances,
        notifications,
        bookmarks,
        teams
      };
    }

    return null;
  },

  isUser: () => accessService.isLoggedIn()
};

const ACTIONS = {
  getCurrentUser({ commit, dispatch }) {
    if (accessService.isLoggedIn()) {
      const { username } = accessService.getDecodedToken();

      commit('setUsername', username);

      return Promise.all([
        dispatch('Users/get', username, { root: true }),
        dispatch('Assets/getCurrentUserBalances', username, { root: true }),
        dispatch('Notifications/fetch', username, { root: true }),
        dispatch('Bookmarks/fetch', username, { root: true })
      ]).then(() => {
        commit('setLoaded', true);
      });
    }

    return Promise.resolve(true);
  },

  signIn({ dispatch }, payload) {

  },

  signOut({ dispatch }) {

  }

};

const MUTATIONS = {
  setUsername(state, payload) {
    state.currentUsername = payload;
  },

  setLoaded(state, payload) {
    state.loaded = payload;
  }
};

export const authStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
