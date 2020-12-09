import deipRpc from '@deip/rpc-client';
import { UsersService } from '@deip/users-service';
import { wrapInArray } from 'vuetify/lib/util/helpers';

import {
  getActionByPath,
  camelizeObjectKeys
} from '@/utils/helpers';

const usersService = UsersService.getInstance();

const actionsMap = {
  team: 'getUsersByTeamId',
  discipline: 'getUsersByDiscipline',
  list: 'getUsersProfiles',
  all: 'getActiveUsers'
};

const getAction = getActionByPath(actionsMap).get;

const STATE = {
  usersList: []
};

const GETTERS = {
  usersList: (state) => _.sortBy(state.usersList, (u) => !u.account.is_research_group)
};

const ACTIONS = {
  getUsersList({ dispatch }, payload) {
    let target = 'all';
    if (payload.users && payload.users.length) target = 'list';
    if (payload.teamId) target = 'team';
    if (payload.disciplineId) target = 'discipline';

    return dispatch(getAction(target), payload);
  },

  getUsersProfiles({ commit }, { users }) {
    return usersService.getEnrichedProfiles(users)
      .then((res) => {
        commit('storeUsersProfiles', res);
      });
  },

  getUsersByTeamId({ commit }, { teamId }) {
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

  getUsersByDiscipline({ commit }, { disciplineId, exclude }) {
    const disciplines = wrapInArray(disciplineId);
    const excludeUsers = wrapInArray(exclude);

    return Promise.all(
      disciplines.map((d) => deipRpc.api.getExpertTokensByDisciplineAsync(d))
    )
      .then((tokens) => {
        const users = [
          ...new Set(
            tokens
              .flat()
              .map((u) => u.account_name)
          )
        ]
          .filter((u) => !excludeUsers.includes(u));

        return usersService.getEnrichedProfiles(users)
          .then((res) => {
            commit('storeUsersProfiles', res);
          });
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
