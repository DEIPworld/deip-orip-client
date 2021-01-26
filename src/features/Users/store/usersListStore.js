import deipRpc from '@deip/rpc-client';
import { UsersService } from '@deip/users-service';
import { wrapInArray } from 'vuetify/lib/util/helpers';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import {
  getActionByPath,
  camelizeObjectKeys
} from '@/utils/helpers';
import { ResearchGroupService } from '@deip/research-group-service';


const usersService = UsersService.getInstance();
const researchGroupService = ResearchGroupService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();

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
        // temp solution
        const allUsers = res;
        const groups = res.filter((u) => u.account.is_research_group);

        if (groups.length) {
          Promise.all(
            groups.map((g) => researchGroupService.getResearchGroup(g.account.name))
          ).then((grs) => {
            for (const group of grs) {
              const target = allUsers
                .findIndex((u) => u.account.name === group.external_id);
              allUsers[target].teamRef = group.researchGroupRef;
            }
            commit('storeUsersProfiles', allUsers);
          });
        } else {
          commit('storeUsersProfiles', allUsers);
        }
        // end
        // commit('storeUsersProfiles', res);
      });
  },

  getUsersByTeamId({ commit }, { teamId }) {
    return usersService.getUsersByResearchGroup(teamId)
      .then((users) => {
        commit('storeUsersProfiles', users);
      });
  },

  getUsersByDiscipline({ commit }, { disciplineId, exclude }) {
    const disciplines = wrapInArray(disciplineId);
    const excludeUsers = wrapInArray(exclude);

    return Promise.all(
      disciplines.map((d) => expertiseContributionsService.getDisciplineExpertiseTokens(d))
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
