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
    if (payload.researchGroupExternalId !== undefined) {
      return userService.getUsersByTeam(payload.researchGroupExternalId)
        .then((users) => {
          usersList.push(...users);
          return Promise.all(usersList.map(
            (user) => expertiseContributionsService.getAccountExpertiseTokens(user.account.name)
          ));
        })
        .then((expList) => {
          for (let i = 0; i < usersList.length; i++) {
            const user = usersList[i];
            user.expertise = expList[i];
          }
          return Promise.all(usersList.map(({ account: { name } }) => expertiseContributionsService.getAccountExpertiseStats(name, {})));
        })
        .then((expertiseStats) => {
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
