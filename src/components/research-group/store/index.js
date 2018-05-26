import _ from 'lodash';
import deipRpc from '@deip/deip-rpc';
import Vue from 'vue';
import * as proposalService from "./../services/ProposalService"; 

const state = {
    proposals: [],
    group: undefined,
    groupShares: []
}


// getters
const getters = {
    proposals: state => state.proposals,
    group: state => state.group,
    groupShares: state => state.groupShares
}

// actions
const actions = {
    loadProposalsByGroupId({ commit }, id) {
        return deipRpc.api.getProposalsByResearchGroupIdAsync(id).then(data => {
            commit('SET_PROPOSALS', 
                _.map(data, proposal => proposalService.getParsedProposal(proposal))
            );
        });
    },
    loadResearchGroupById({ commit }, id) {
        return deipRpc.api.getResearchGroupByIdAsync(id).then(data => {
            commit('SET_RESEARCH_GROUP', data);
        });
    },
    loadSharesByGroupId({ commit }, id) {
        return deipRpc.api.getResearchGroupTokensByResearchGroupAsync(id).then(data => {
            commit('SET_GROUP_SHARES', data);
        });
    },

    changeProposal({ commit }, payload) {
        commit('CHANGE_PROPOSAL', payload);
    }
}

// mutations
const mutations = {
    ['SET_PROPOSALS'](state, proposals) {
        Vue.set(state, 'proposals', proposals);
    },
    ['SET_RESEARCH_GROUP'](state, group) {
        Vue.set(state, 'group', group);
    },
    ['SET_GROUP_SHARES'](state, shares) {
        Vue.set(state, 'groupShares', shares);
    },
    ['CHANGE_PROPOSAL'](state, payload) {
        let index = state.proposals.indexOf(payload.old);

        if (index !== -1) {
            state.proposals.splice(index, 1, payload.new);
        }
    },
}

const namespaced = true;

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations
}