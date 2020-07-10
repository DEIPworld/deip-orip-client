import deipRpc from '@deip/rpc-client';
import Vue from 'vue';

import { ResearchService } from '@deip/research-service';

const researchService = ResearchService.getInstance();

const state = {
  research: null,
  researchRef: null,

  isLoadingResearchEditPage: undefined
};

// getters
const getters = {
  research: (state) => state.research,
  researchRef: (state) => state.research.researchRef,
  isLoadingResearchEditPage: (state) => state.isLoadingResearchEditPage
};

// actions
const actions = {
  loadResearchEditPage({ state, commit, dispatch }, { group_permlink, research_permlink }) {
    commit('SET_RESEARCH_EDIT_LOADING_STATE', true);

    // TODO: replace permliks with external_id in routes
    return deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)
      .then((research) => researchService.getResearch(research.external_id))
      .then((research) => {
        commit('SET_RESEARCH_DETAILS', research);
      }, ((err) => { console.error(err); }))
      .finally(() => {
        commit('SET_RESEARCH_EDIT_LOADING_STATE', false);
      });
  }
};

// mutations
const mutations = {

  SET_RESEARCH_DETAILS(state, research) {
    state.research = research;
  },

  SET_RESEARCH_EDIT_LOADING_STATE(state, isLoading) {
    state.isLoadingResearchEditPage = isLoading;
  }
};

const namespaced = true;

export const reStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
