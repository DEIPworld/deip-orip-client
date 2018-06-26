import _ from 'lodash';
import deipRpc from '@deip/deip-rpc';
import Vue from 'vue';
import * as proposalService from "./../../../services/ProposalService"; 
import joinRequestsService from './../../../services/joinRequests'
import { getEnrichedProfiles } from './../../../utils/user'
import { constants } from 'os';

const state = {
    proposals: [],
    group: undefined,
    groupShares: [],
    researchList: [],
    members: [],
    joinRequests: [],

    options: {
        isAddMemberDialogOpen: false,
    },

    proposalListFilter: {
        areShownPastProposals: false,
        sortBy: 'creation_time',
        order: 'asc'
    },

    isLoadingResearchGroupDetails: undefined,
    isLoadingResearchGroupMembers: undefined,
    isLoadingResearchGroupResearchList: undefined,
    isLoadingResearchGroupProposals: undefined,
    isLoadingResearchGroupJoinRequests: undefined
}


// getters
const getters = {
    proposals: state => state.proposals,
    group: state => state.group,
    groupShares: state => state.groupShares,
    members: state => state.members,
    proposalListFilter: state => state.proposalListFilter,
    researchList: state => state.researchList,
    options: state => state.options,
    joinRequests: state => state.joinRequests,
    pendingJoinRequests: state => state.joinRequests.filter(r => r.status == 'Pending'),
    isLoadingResearchGroupDetails: state => state.isLoadingResearchGroupDetails,
    isLoadingResearchGroupMembers: state => state.isLoadingResearchGroupMembers,
    isLoadingResearchGroupResearchList: state => state.isLoadingResearchGroupResearchList,
    isLoadingResearchGroupProposals: state => state.isLoadingResearchGroupProposals,
    isLoadingResearchGroupJoinRequests: state => state.isLoadingResearchGroupJoinRequests
}

// actions
const actions = {
    loadResearchGroupProposals({ commit }, id) {
        commit('SET_GROUP_PROPOSALS_LOADING_STATE', true)
        deipRpc.api.getProposalsByResearchGroupIdAsync(id).then(data => {
            commit('SET_PROPOSALS', 
                _.map(data, proposal => proposalService.getParsedProposal(proposal))
            );
        })
        .finally(() => {
            commit('SET_GROUP_PROPOSALS_LOADING_STATE', false)
        })
    },
    loadResearchGroup({ commit, dispatch, state }, permlink) {
        commit('SET_GROUP_DETAILS_LOADING_STATE', true)
        deipRpc.api.getResearchGroupByPermlinkAsync(permlink).then(data => {
            commit('SET_RESEARCH_GROUP', data);

            dispatch('loadResearchGroupProposals', state.group.id);
            dispatch('loadResearchList', state.group.id);
            dispatch('loadResearchGroupMembers', state.group.id);
            dispatch('loadJoinRequests', state.group.id)
        })
        .finally(() => {
            commit('SET_GROUP_DETAILS_LOADING_STATE', false)
        });
    },

    loadResearchList({ commit }, id) {
        const researchResult = [];
        commit('SET_GROUP_RESEARCH_LIST_LOADING_STATE', true)

        deipRpc.api.getResearchesByResearchGroupIdAsync(id)
            .then(list => {
                researchResult.push(...list)
                
                return Promise.all(
                    list.map(item => deipRpc.api.getTotalVotesByResearchAsync(item.research_id))
                );
            })
            .then(list => {
                const tvoMap = _.chain(list)
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
            })
            .finally(() => {
                commit('SET_GROUP_RESEARCH_LIST_LOADING_STATE', false)
            })
    },

    loadResearchGroupMembers({ commit, state }, groupId) {
        const members = [];
        commit('SET_GROUP_MEMBERS_LOADING_STATE', true)
        deipRpc.api.getResearchGroupTokensByResearchGroupAsync(groupId)
            .then(rgtList => {
                commit('SET_GROUP_SHARES', rgtList);
                rgtList.forEach(rgt => {members.push({rgt: rgt})})
                return getEnrichedProfiles(members.map(member => member.rgt.owner))
            })
            .then((users) => {
                const promises = []
                members.forEach(member => {
                    const user = users.find(user => user.account.name == member.rgt.owner);
                    member.account = user.account;
                    member.profile = user.profile;
                    promises.push(deipRpc.api.getExpertTokensByAccountNameAsync(member.account.name))
                })
                return Promise.all(promises);
            })
            .then((expList) => {
                members.forEach((member, idx) => {
                    const exp = expList[idx];
                    member.expertise = exp;
                })
                commit('SET_GROUP_MEMBERS', members);
            })
            .finally(() => {
                commit('SET_GROUP_MEMBERS_LOADING_STATE', false)
            })
    },

    changeProposal({ commit }, payload) {
        commit('CHANGE_PROPOSAL', payload);
    },
    updateProposalFilter({ commit }, payload) {
        commit('UPDATE_PROPOSAL_FILTER', payload);
    },
    changeOptions({ commit }, payload) {
        commit('UPDATE_OPTIONS', payload);
    },

    loadJoinRequests({ commit, state }, id) {
        const joinRequests = [];
        commit('SET_GROUP_JOIN_REQUESTS_LOADING_STATE', true)
        joinRequestsService.getJoinRequestsByGroup(id)
            .then((requests) => {
                joinRequests.push(...requests);
                return getEnrichedProfiles(joinRequests.map(request => request.username))
            }, (err) => {
                console.log(err);
            }).then((users) => {
                joinRequests.forEach((request, idx) => {
                    const user = users[idx];
                    request.user = user;
                })
                commit('SET_JOIN_REQUESTS', joinRequests);
            })
            .finally(() => {
                commit('SET_GROUP_JOIN_REQUESTS_LOADING_STATE', false);
            })
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

    ['SET_JOIN_REQUESTS'](state, joinRequests) {
        Vue.set(state, 'joinRequests', joinRequests);
    },

    ['SET_GROUP_DETAILS_LOADING_STATE'](state, value) {
        state.isLoadingResearchGroupDetails = value;
    },

    ['SET_GROUP_MEMBERS_LOADING_STATE'](state, value) {
        state.isLoadingResearchGroupMembers = value;
    },

    ['SET_GROUP_RESEARCH_LIST_LOADING_STATE'](state, value) {
        state.isLoadingResearchGroupResearchList = value;
    },

    ['SET_GROUP_PROPOSALS_LOADING_STATE'](state, value) {
        state.isLoadingResearchGroupProposals = value;
    },

    ['SET_GROUP_JOIN_REQUESTS_LOADING_STATE'](state, value) {
        state.isLoadingResearchGroupJoinRequests = value;
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