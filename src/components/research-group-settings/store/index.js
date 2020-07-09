import deipRpc from '@deip/rpc-client';
import Vue from 'vue';

import { ResearchGroupService } from '@deip/research-group-service';

const researchGroupService = ResearchGroupService.getInstance();

const state = {
  group: undefined,

  isLoadingResearchGroupDetails: undefined,
  isLoadingResearchGroupProposals: undefined
};

// getters
const getters = {
  group: (state) => state.group,

  isLoadingResearchGroupDetails: (state) => state.isLoadingResearchGroupDetails,
  isLoadingResearchGroupProposals: (state) => state.isLoadingResearchGroupProposals
};

// actions
const actions = {

  loadResearchGroup({ commit, dispatch, state }, { permlink }) {
    commit('SET_GROUP_DETAILS_LOADING_STATE', true);

    return deipRpc.api.getResearchGroupByPermlinkAsync(permlink)
      .then((data) => {
        commit('SET_RESEARCH_GROUP', data);
        return Promise.all([]);
      })
      .finally(() => {
        commit('SET_GROUP_DETAILS_LOADING_STATE', false);
      });
  }
};

// mutations
const mutations = {

  SET_RESEARCH_GROUP(state, group) {
    state.group = group;
  },

  SET_GROUP_DETAILS_LOADING_STATE(state, value) {
    state.isLoadingResearchGroupDetails = value;
  },

  SET_GROUP_PROPOSALS_LOADING_STATE(state, value) {
    state.isLoadingResearchGroupProposals = value;
  }
};

const namespaced = true;

export const researchGroupSettingsStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
