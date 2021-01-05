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
    return userService.getResearchBookmarks(username)
      .then((bookmarks) => {
        commit('setList', bookmarks);
      })
      .catch((err) => {
        console.error(err);
      });
  },
};

const MUTATIONS = {
  setList(state, payload) {
    state.data = payload;
  }
};

export const bookmarksStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};