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
  team: 'getUsersByTeam',
  list: 'getUsers',
  tenant: 'getTenantUsers',
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
    if (payload.tenantId) target = 'tenant';

    return dispatch(getAction(target), payload);
  },

  getUsers({ commit }, { users }) {
    return usersService.getUsers(users)
      .then((items) => {
        commit('storeUsersProfiles', items);
      });
  },

  getUsersByTeam({ commit }, { teamId }) {
    return usersService.getUsersByResearchGroup(teamId)
      .then((users) => {
        commit('storeUsersProfiles', users);
      });
  },

  getActiveUsers({ commit }) {
    return usersService.getUsersListing("approved")
      .then((users) => {
        commit('storeUsersProfiles', users);
      });
  },

  getTenantUsers({ commit }, { tenantId }) {
    return usersService.getUsersByTenant(tenantId)
      .then((users) => {
        commit('storeUsersProfiles', users);
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
