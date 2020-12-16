import { UsersService } from '@deip/users-service';
import { camelizeObjectKeys, mergeCollection } from '@/utils/helpers';
import where from 'filter-where';

const usersService = UsersService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state) => (query = {}) => state.data.filter(
    where(query)
  ),

  one: (state) => (username, query = {}) => {
    const conditions = {
      ...(username ? { username } : {}),
      ...query
    };
    return state.data.find(where(conditions));
  }
};

const ACTIONS = {

  get({ dispatch }, username) {
    return Promise.all([
      dispatch('getUserData', username)
    ]);
  },

  getUserData({ commit }, username) {
    return usersService.getUser(username)
      .then(({ account, profile }) => {
        commit('storeOne', {
          username,
          account,
          profile
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const MUTATIONS = {
  storeOne(state, payload) {
    if (!payload) return;

    state.data = mergeCollection(
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
