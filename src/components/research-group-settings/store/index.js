import deipRpc from '@deip/deip-oa-rpc-client';
import Vue from 'vue';
import * as proposalService from "./../../../services/ProposalService";

const state = {
  group: undefined,

  isLoadingResearchGroupDetails: undefined,
  isLoadingResearchGroupProposals: undefined
}


// getters
const getters = {
  group: state => state.group,

  isLoadingResearchGroupDetails: state => state.isLoadingResearchGroupDetails,
  isLoadingResearchGroupProposals: state => state.isLoadingResearchGroupProposals
}

// actions
const actions = {

  loadResearchGroup({
    commit,
    dispatch,
    state
  }, {
    permlink
  }) {
    commit('SET_GROUP_DETAILS_LOADING_STATE', true);

    return deipRpc.api.getResearchGroupByPermlinkAsync(permlink).then(data => {
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

  loadResearchGroupProposals({
    commit
  }, {
    groupId,
    notify
  }) {
    commit('SET_GROUP_PROPOSALS_LOADING_STATE', true);

    deipRpc.api.getProposalsByResearchGroupIdAsync(groupId)
      .then(data => {
        return Promise.all(
          data.map(item =>
            proposalService.extendProposalByRelatedInfo(
              proposalService.getParsedProposal(item)
            )
          )
        );
      })
      .then(data => {
        commit('SET_PROPOSALS', data);
      })
      .finally(() => {
        commit('SET_GROUP_PROPOSALS_LOADING_STATE', false)
        if (notify) notify()
      });
  },
}

// mutations
const mutations = {
  ['SET_PROPOSALS'](state, proposals) {
    Vue.set(state, 'proposals', proposals);
  },

  ['SET_RESEARCH_GROUP'](state, group) {
    Vue.set(state, 'group', group);
  },

  ['SET_GROUP_DETAILS_LOADING_STATE'](state, value) {
    state.isLoadingResearchGroupDetails = value;
  },

  ['SET_GROUP_PROPOSALS_LOADING_STATE'](state, value) {
    state.isLoadingResearchGroupProposals = value;
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
