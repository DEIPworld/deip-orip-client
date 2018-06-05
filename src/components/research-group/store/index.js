import _ from 'lodash';
import deipRpc from '@deip/deip-rpc';
import Vue from 'vue';
import * as proposalService from "./../services/ProposalService"; 

const state = {
    proposals: [],
    group: undefined,
    groupShares: [],
    researchList: [],
    members: [],

    options: {
        isAddMemberDialogOpen: false,
    },

    proposalListFilter: {
        areShownPastProposals: false,
        sortBy: 'creation_time',
        order: 'asc'
    }
}


// getters
const getters = {
    proposals: state => state.proposals,
    group: state => state.group,
    groupShares: state => state.groupShares,
    members: state => state.members,
    proposalListFilter: state => state.proposalListFilter,
    researchList: state => state.researchList,
    options: state => state.options
}

// actions
const actions = {
    loadResearchGroupProposals({ commit }, id) {
        deipRpc.api.getProposalsByResearchGroupIdAsync(id).then(data => {
            commit('SET_PROPOSALS', 
                _.map(data, proposal => proposalService.getParsedProposal(proposal))
            );
        });
    },
    loadResearchGroup({ commit, dispatch, state }, permlink) {
        deipRpc.api.getResearchGroupByPermlinkAsync(permlink).then(data => {
            commit('SET_RESEARCH_GROUP', data);

            dispatch('loadResearchGroupProposals', state.group.id);
            dispatch('loadResearchList', state.group.id);

            dispatch('loadResearchGroupShares', state.group.id)
                .then(data => {
                    dispatch('loadResearchGroupAccounts', data.map(item => item.owner));
                });
        });
    },
    loadResearchGroupShares({ commit, state }, id) {
        return deipRpc.api.getResearchGroupTokensByResearchGroupAsync(id).then(data => {
            commit('SET_GROUP_SHARES', data);
            return data;
        });
    },
    loadResearchList({ commit }, id) {
        let researchResult = [];

        deipRpc.api.getResearchesByResearchGroupIdAsync(id)
            .then(data => {
                // commit('SET_GROUP_RESEARCH_LIST', data);
                researchResult = data;
                
                return Promise.all(
                    data.map(item => deipRpc.api.getTotalVotesByResearchAsync(item.research_id))
                );
            })
            .then(list => {
                let tvoMap = _.chain(list)
                    .flatten()
                    .groupBy('research_id')
                    .value();

                researchResult.forEach(research => {
                    research.totalVotes = tvoMap[research.id] ? tvoMap[research.id] : [];
                });

                return researchResult;
            })
            .then(data => {
                commit('SET_GROUP_RESEARCH_LIST', data);
            }).catch(() => {
                commit('SET_GROUP_RESEARCH_LIST', researchResult);
            });
    },
    loadResearchGroupAccounts({ commit, state }, accountNames) {
        let accounts = [];

        return deipRpc.api.getAccountsAsync(accountNames)
            .then(data => {
                accounts = _.each(data, (item, i) => { 
                    item.expertise = [];
                    item.groupShares = state.groupShares[i];
                });

                return Promise.all(
                    data.map(account => 
                        deipRpc.api.getExpertTokensByAccountNameAsync(account.name)
                    )
                );
            })
            .then(expertTokens => {
                accounts.forEach((account, i) => { 
                    account.expertise = expertTokens[i];
                });
                
                commit('SET_GROUP_MEMBERS', accounts);
            }).catch(() => {
                commit('SET_GROUP_MEMBERS', accounts);
            });
    },

    changeProposal({ commit }, payload) {
        commit('CHANGE_PROPOSAL', payload);
    },
    updateProposalFilter({ commit }, payload) {
        commit('UPDATE_PROPOSAL_FILTER', payload);
    },
    changeOptions({ commit }, payload) {
        commit('UPDATE_OPTIONS', payload);
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
    ['SET_GROUP_MEMBERS'](state, members) {
        Vue.set(state, 'members', members);
    },
    ['SET_GROUP_RESEARCH_LIST'](state, researchList) {
        Vue.set(state, 'researchList', researchList);
    },
    ['CHANGE_PROPOSAL'](state, payload) {
        let index = state.proposals.indexOf(payload.old);

        if (index !== -1) {
            state.proposals.splice(index, 1, payload.new);
        }
    },
    ['UPDATE_PROPOSAL_FILTER'](state, { key, value }) {
        Vue.set(state.proposalListFilter, key, value);
    },
    ['UPDATE_OPTIONS'](state, { key, value }) {
        Vue.set(state.options, key, value);
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