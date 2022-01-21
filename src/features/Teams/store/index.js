import {
  camelizeObjectKeys,
  collectionList,
  collectionMerge,
  collectionOne,
  wrapInArray
} from '@deip/toolbox';

import { TeamService } from '@deip/team-service';

const teamService = TeamService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state) => (query = {}) => collectionList(state.data, query),

  one: (state) => (_id, query = {}) => collectionOne(state.data, {
    _id,
    ...query
  })
};

const ACTIONS = {
  fetch({ commit }) {
    return teamService
      .getTeamsListing()
      .then(({ data: { items: teams } }) => {
        commit('setList', teams);
      });
  },

  get({ commit }, payload) {
    return teamService
      .getTeams(wrapInArray(payload))
      .then(({ data: { items: teams } }) => {
        commit('setList', teams);
      });
  },

  getUserTeams({ commit }, username) {
    return teamService.getTeamsByUser(username)
      .then(({ data: { items: teams } }) => {
        commit('setList', teams);
      });
  }
};

const MUTATIONS = {
  setList(state, payload) {
    if (!payload) return;

    state.data = collectionMerge(
      state.data,
      // payload.map((asset) => camelizeObjectKeys(asset)),
      payload,
      { key: '_id' }
    );
  },

  setOne(state, payload) {
    if (!payload) return;

    state.data = collectionMerge(
      state.data,
      // camelizeObjectKeys(payload),
      payload,
      { key: '_id' }
    );
  }
};

export const teamsStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
