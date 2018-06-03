import _ from 'lodash';
import deipRpc from '@deip/deip-rpc';
import Vue from 'vue';

const state = {
    userInfo: undefined,
    researchTokens: [], // ?, clear out what kind of research we should show
    groups: [],
    expertise: []
}

// getters
const getters = {
    userInfo: state => state.userInfo,
    researchTokens: state => state.researchTokens,
    groups: state => state.groups,
    expertise: state => state.expertise
}

// actions
const actions = {
    loadUser({ dispatch }, accountName) {
        dispatch('loadUserInfo', accountName);
        dispatch('loadExpertise', accountName);
        dispatch('loadResearchTokens', accountName);
        dispatch('loadGroups', accountName);
    },
    loadUserInfo({ commit }, accountName) {
        return deipRpc.api.getAccountsAsync([accountName]).then(data => {
            commit('SET_USER_INFO', data[0]);
        });
    },
    loadResearchTokens({ commit }, accountName) {
        return deipRpc.api.getResearchTokensByAccountNameAsync(accountName).then(data => {
            commit('SET_RESEARCH_TOKENS', data);
        })
    },
    loadGroups({ commit }, accountName) {
        return deipRpc.api.getResearchGroupTokensByAccountAsync(accountName).then(data => {
            let groupsInfo = Promise.all(
                data.map(groupToken => deipRpc.api.getResearchGroupByIdAsync(groupToken.research_group_id))
            );

            let groupsShares = Promise.all(
                data.map(groupToken => deipRpc.api.getResearchGroupTokensByResearchGroupAsync(groupToken.research_group_id))
            );

            return Promise.all([groupsInfo, groupsShares]);
        }).then(([groupsInfo, groupsShares]) => {
            let groups = _.each(groupsInfo, (item, i) => { item.shares = groupsShares[i] });
            commit('SET_RESEARCH_GROUPS', groups);
        })
    },
    loadExpertise({ commit }, accountName) {
        return deipRpc.api.getExpertTokensByAccountNameAsync(accountName).then(data => {
            commit('SET_EXPERTISE', data);
        })
    }
}

// mutations
const mutations = {
    ['SET_USER_INFO'](state, userInfo) {
        Vue.set(state, 'userInfo', userInfo);
    },
    ['SET_RESEARCH_TOKENS'](state, researchTokens) {
        Vue.set(state, 'researchTokens', researchTokens);
    },
    ['SET_RESEARCH_GROUPS'](state, groups) {
        Vue.set(state, 'groups', groups);
    },
    ['SET_EXPERTISE'](state, expertise) {
        Vue.set(state, 'expertise', expertise);
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