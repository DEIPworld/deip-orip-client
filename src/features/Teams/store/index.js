import { collectionList, collectionOne } from '@/utils/helpers';

const STATE = {
  data: []
};

const GETTERS = {
  list: (state) => (query = {}) => collectionList(state.data, query),

  one: (state) => (teamId, query = {}) => collectionOne(state.data, {
    ...(teamId ? { teamId } : {}),
    ...query
  })
};

const ACTIONS = {};

const MUTATIONS = {};

export const teamsStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
