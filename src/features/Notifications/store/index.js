import { UserService } from '@deip/user-service';

const userService = UserService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state) => state.data
};

const ACTIONS = {
  fetch({ commit }, username) {
    return userService.getNotificationsByUser(username)
      .then((notifications) => {
        commit('setList', notifications);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  // ////////////////////

  markAsRead({ dispatch }, [username, id]) {
    return userService
      .markUserNotificationAsRead(username, id)
      .then(() => {
        dispatch('fetch', username);
      });
  }
};

const MUTATIONS = {
  setList(state, payload) {
    state.data = payload;
  }
};

export const notificationsStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
