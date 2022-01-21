import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { UserService } from '@deip/user-service';

const userService = UserService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const STATE = {
  users: []
};

const GETTERS = {
  users: (state) => state.users
};

const ACTIONS = {
  loadUsers({ commit }, payload) {
    const usersList = [];
    if (payload.teamId !== undefined) {
      return userService.getUsersByTeam(payload.teamId)
        .then(({ data: { items: users } }) => {
          usersList.push(...users);
          return Promise.all(usersList.map(
            (user) => expertiseContributionsService.getAccountExpertiseTokens(user.account.name)
          ));
        })
        .then((res) => {
          const expList = res.map(({ data: { items } }) => items);
          for (let i = 0; i < usersList.length; i++) {
            const user = usersList[i];
            user.expertise = expList[i];
          }
          return Promise.all(usersList.map(({ account: { name } }) => expertiseContributionsService.getAccountExpertiseStats(name, {})));
        })
        .then((res) => {
          const expertiseStats = res.map(({ data }) => data)
          for (let i = 0; i < usersList.length; i++) {
            const user = usersList[i];
            user.expertiseStats = expertiseStats[i];
          }
          commit('SET_USERS', usersList);
        })
        .catch((err) => console.error(err));
    }
    return commit('SET_USERS', usersList);
  }

};

const MUTATIONS = {
  SET_USERS(state, users) {
    state.users = users;
  }
};

export const usersListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
