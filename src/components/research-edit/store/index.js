import deipRpc from '@deip/deip-oa-rpc-client'
import Vue from 'vue'

const state = {
  research: null,
  isLoadingResearchEditPage: undefined
}

// getters
const getters = {
  research: (state) => state.research,
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
      }, (err => { console.log(err) }))
      .finally(() => {
        commit('SET_RESEARCH_EDIT_LOADING_STATE', false)
      })
  }
}

// mutations
const mutations = {

  ['SET_RESEARCH_DETAILS'](state, research) {
    Vue.set(state, 'research', research)
  },

  ['SET_RESEARCH_EDIT_LOADING_STATE'](state, isLoading) {
    Vue.set(state, 'isLoadingResearchEditPage', isLoading)
  }
}

const namespaced = true;

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}