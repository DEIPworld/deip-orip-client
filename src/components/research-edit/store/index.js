import deipRpc from '@deip/rpc-client';
import Vue from 'vue';

import { ResearchService } from '@deip/research-service';

const researchService = ResearchService.getInstance();

const state = {
  research: null,
  researchRef: null,

  isLoadingResearchEditPage: undefined
}

// getters
const getters = {
  research: (state) => state.research,
  researchRef: (state) => state.researchRef,
  isLoadingResearchRef: (state) => state.isLoadingResearchRef,
  isLoadingResearchEditPage: (state) => state.isLoadingResearchEditPage
}

// actions
const actions = {
  loadResearchEditPage({ state, commit, dispatch }, { group_permlink, research_permlink }) {
    commit('SET_RESEARCH_EDIT_LOADING_STATE', true);

    return deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)
      .then((research) => {
        research.group_permlink = group_permlink;
        commit('SET_RESEARCH_DETAILS', research);

        const researchRefLoad = new Promise((resolve, reject) => {
          dispatch('loadResearchRef', { researchId: state.research.id, notify: resolve })
        });

        return researchRefLoad

      }, (err => { console.log(err) }))
      .finally(() => {
        commit('SET_RESEARCH_EDIT_LOADING_STATE', false)
      })
  },
  loadResearchRef({ state, dispatch, commit }, { researchId, notify }) {
    commit('SET_RESEARCH_REF_DETAILS_LOADING_STATE', true);
    return researchService.getResearch(researchId)
      .then(researchRef => {
        commit('SET_RESEARCH_REF_DETAILS', researchRef);
      }, (err) => {console.log(err)})
      .finally(() => {
        commit('SET_RESEARCH_REF_DETAILS_LOADING_STATE', false);
        if (notify) notify();
      })
  }
}

// mutations
const mutations = {

  ['SET_RESEARCH_DETAILS'](state, research) {
    Vue.set(state, 'research', research)
  },

  ['SET_RESEARCH_REF_DETAILS'](state, researchRef) {
    Vue.set(state, 'researchRef', researchRef)
  },

  ['SET_RESEARCH_REF_DETAILS_LOADING_STATE'](state, isLoading) {
    Vue.set(state, 'isLoadingResearchRef', isLoading)
  },

  ['SET_RESEARCH_EDIT_LOADING_STATE'](state, isLoading) {
    Vue.set(state, 'isLoadingResearchEditPage', isLoading)
  }
}

const namespaced = true;

export const reStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
