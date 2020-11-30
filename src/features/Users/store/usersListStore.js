import deipRpc from '@deip/rpc-client';
import { UsersService } from '@deip/users-service';

import {
  getActionByPath,
  camelizeObjectKeys,
} from '@/utils/helpers';

const usersService = UsersService.getInstance();

const actionsMap = {
  team: 'getUsersByTeamId',
  list: 'getUsersProfiles',
  all: 'getActiveUsers'
};

const getAction = getActionByPath(actionsMap).get;

const STATE = {
  usersList: []
};

const GETTERS = {
  usersList: (state) => state.usersList
};

const ACTIONS = {
  getUsersList({ dispatch }, payload) {
    let target = 'all';
    if (payload.users && payload.users.length) target = 'list';
    if (payload.teamId) target = 'team';

    return dispatch(getAction(target), payload);
  },

  getUsersProfiles({ commit }, { users }) {
    return usersService.getEnrichedProfiles(users)
      .then((res) => {
        commit('storeUsersProfiles', res);
      });
  },

  getUsersByTeamId({ commit, dispatch }, { teamId }) {
    return deipRpc.api.getResearchGroupMembershipTokensAsync(teamId)
      .then((tokens) => {
        const users = tokens.map((t) => t.owner);

        return usersService.getEnrichedProfiles(users)
          .then((res) => {
            commit('storeUsersProfiles', res.map((user) => ({
              ...user,
              groupTokens: tokens.find((t) => t.owner === user.account.name)
            })));
          });
      });
  },

  getActiveUsers({ commit }) {
    return usersService.getActiveUsers()
      .then((res) => {
        commit('storeUsersProfiles', res);
      });
  },
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
