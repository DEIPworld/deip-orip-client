import { UserService } from '@deip/user-service';
import {
  getActionByPath
} from '@/utils/helpers';


const userService = UserService.getInstance();

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
    return userService.getUsers(users)
      .then((items) => {
        commit('storeUsersProfiles', items);
      });
  },

  getUsersByTeam({ commit }, { teamId }) {
    return userService.getUsersByTeam(teamId)
      .then((users) => {
        commit('storeUsersProfiles', users);
      });
  },

  getActiveUsers({ commit }) {
    return userService.getUsersListing("approved")
      .then((users) => {
        commit('storeUsersProfiles', users);
      });
  },

  getTenantUsers({ commit }, { tenantId }) {
    return userService.getUsersByTenant(tenantId)
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
