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

    return deipRpc.api.getResearchGroupByPermlinkAsync(permlink).then((data) => {
      commit('SET_RESEARCH_GROUP', data);

      const proposalsLoad = new Promise((resolve, reject) => {
        dispatch('loadResearchGroupProposals', {
          groupId: state.group.id,
          notify: resolve
        });
      });

      return Promise.all([proposalsLoad]);
    })
      .finally(() => {
        commit('SET_GROUP_DETAILS_LOADING_STATE', false);
      });
  },

  loadResearchGroupProposals({ commit }, { groupId, notify }) {
    commit('SET_GROUP_PROPOSALS_LOADING_STATE', true);

    deipRpc.api.getProposalsByResearchGroupIdAsync(groupId)
      .then((data) => Promise.all(
        data.map(
          (item) => researchGroupService.extendProposalByRelatedInfo({
            ...item,
            ...{ data: JSON.parse(item.data) }
          })
        )
      ))
      .then((data) => {
        commit('SET_PROPOSALS', data);
      })
      .finally(() => {
        commit('SET_GROUP_PROPOSALS_LOADING_STATE', false);
        if (notify) notify();
      });
  }
};

// mutations
const mutations = {
  SET_PROPOSALS(state, proposals) {
    Vue.set(state, 'proposals', proposals);
  },

  SET_RESEARCH_GROUP(state, group) {
    Vue.set(state, 'group', group);
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
