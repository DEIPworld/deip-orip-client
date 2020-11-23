import { UsersService } from '@deip/users-service';

const usersService = UsersService.getInstance();

const STATE = {
  usersList: []
};

const GETTERS = {
  usersList: (state) => state.usersList
};

const ACTIONS = {
  getUsersProfiles({ commit }, users) {
    return usersService.getEnrichedProfiles(users)
      .then((res) => {
        commit('storeUsersProfiles', res);
      });
  },
  getActiveUsers({ commit }) {
    return usersService.getActiveUsers()
      .then((res) => {
        commit('storeUsersProfiles', res);
      });
  }
};

const MUTATIONS = {
  storeUsersProfiles(state, payload) {
    state.usersList = payload;
  }
};

export const usersListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
