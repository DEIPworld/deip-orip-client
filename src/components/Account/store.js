import { UserService } from '@deip/user-service';

const userService = UserService.getInstance();

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
    userService.getUser(username)
      .then(({ data: user }) => {
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
