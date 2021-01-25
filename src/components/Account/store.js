import { UsersService } from '@deip/users-service';

const usersService = UsersService.getInstance();

const state = {
  user: undefined
};

// getters
const getters = {
  userInfo: (state, getters) => ({
    account: state.user.account,
    profile: state.user.profile
  })
};

// actions
const actions = {

  loadUser({ state, commit, dispatch }, { username }) {
    usersService.getUser(username)
      .then((user) => {
        commit('SET_USER', user);
      });
  }
};

// mutations
const mutations = {
  SET_USER(state, user) {
    state.user = user;
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
