import { UsersService } from '@deip/users-service';
import { ResearchGroupService } from '@deip/research-group-service';
import {
  camelizeObjectKeys,
  collectionList,
  collectionMerge,
  collectionOne
} from '@/utils/helpers';

const usersService = UsersService.getInstance();
const teamsService = ResearchGroupService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state) => (query = {}) => collectionList(state.data, query),

  one: (state) => (username, query = {}) => collectionOne(state.data, {
    ...(username ? { username } : {}),
    ...query
  })
};

const ACTIONS = {
  get({ commit }, username) {
    return Promise.all([
      usersService.getUser(username),
      teamsService.getTeamsByUser(username)
    ])
      .then(([{ account, profile }, teams]) => {
        commit('setOne', {
          username,
          account,
          profile,
          teams
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const MUTATIONS = {
  setOne(state, payload) {
    if (!payload) return;

    state.data = collectionMerge(
      state.data,
      camelizeObjectKeys(payload),
      { id: 'username' }
    );
  }
};

export const usersStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};

export * from './usersListStore';
