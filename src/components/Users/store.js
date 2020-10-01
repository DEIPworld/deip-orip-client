import { UsersService } from '@deip/users-service';

const usersService = UsersService.getInstance();

const STATE = {
  list: []
};

const GETTERS = {
  list: (state) => state.list
};

const ACTIONS = {
  getUsersProfiles({ commit }, users) {
    return usersService.getEnrichedProfiles(users)
      .then((res) => {
        console.log(res)
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
    state.list = payload;
  }
};

export const usersStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
