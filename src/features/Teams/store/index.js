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

  one: (state) => (externalId, query = {}) => collectionOne(state.data, {
    externalId,
    ...query
  })
};

const ACTIONS = {
  fetch({ commit }) {
    return teamService
      .getTeamsListing()
      .then((teams) => {
        commit('setList', teams);
      });
  },

  get({ commit }, payload) {
    return teamService
      .getTeams(wrapInArray(payload))
      .then((teams) => {
        commit('setList', teams);
      });
  },

  getUserTeams({ commit }, username) {
    return teamService.getTeamsByUser(username)
      .then((teams) => {
        commit('setList', teams);
      });
  }
};

const MUTATIONS = {
  setList(state, payload) {
    if (!payload) return;

    state.data = collectionMerge(
      state.data,
      payload.map((asset) => camelizeObjectKeys(asset)),
      { key: 'externalId' }
    );
  },

  setOne(state, payload) {
    if (!payload) return;

    state.data = collectionMerge(
      state.data,
      camelizeObjectKeys(payload),
      { key: 'externalId' }
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
