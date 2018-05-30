import _ from 'lodash';
import deipRpc from '@deip/deip-rpc';
import Vue from 'vue'

import { isLoggedIn, getDecodedToken, getOwnerWif } from './../../../utils/auth'

const state = {
    user: {
        username: isLoggedIn() ? getDecodedToken().username : null,
        pubKey: isLoggedIn() ? getDecodedToken().pubKey : null,
        privKey: isLoggedIn() ? getOwnerWif() : null,
        expertTokens: [],
        groupTokens: [],
        disciplines: [],
        groups: []
    }
}

// getters
const getters = {
    user: (state, getters) => {
        return state.user
    },

    userExperise: (state, getters) => {
        const experise = [];
        for (let i = 0; i < state.user.expertTokens.length; i++) {
            const exp = state.user.expertTokens[i];
            const discipline = state.user.disciplines.find(d => { return d.id == exp.discipline_id });
            exp.discipline_name = discipline.name;
            experise.push(exp);
        }
        return experise;
    },

    userGroups: (state, getters) => {
        const groups = [];
        for (let i = 0; i < state.user.groupTokens.length; i++) {
            const rgt = state.user.groupTokens[i];
            const group = state.user.groups.find(g => g.id === rgt.research_group_id)
            groups.push({
                id: group.id,
                permlink: group.permlink,
                name: group.name,
                quorum_percent: group.quorum_percent,
                weight: rgt.amount,
                rgtId: rgt.id
            })
        }
        return groups;
    },

    userIsResearchGroupMember: (state, getters) => {
        return groupId => getters.userGroups.find(group => {
            return groupId === group.id}) !== undefined;
    }
}

// actions
const actions = {

    loadExpertTokens({ state, commit, getters }) {
        const user = getters.user;
        const expertTokens = [];

        if (user.username) {
            deipRpc.api.getExpertTokensByAccountNameAsync(user.username)
                .then((tokensList) => {
                    const promises = [];
                    for (var i = 0; i < tokensList.length; i++) {
                        var exp = tokensList[i];
                        expertTokens.push(exp);
                        promises.push(deipRpc.api.getDisciplineAsync(exp.discipline_id))
                    }
                    return Promise.all(promises);
                })
                .then((disciplines) => {
                    commit('SET_USER_DISCIPLINES_LIST', disciplines)
                    commit('SET_USER_EXPERT_TOKENS_LIST', expertTokens)
                });
        }
    },

    loadGroups({ state, commit, getters }) {
        const user = getters.user;
        const groupTokens = [];

        if (user.username) {
            deipRpc.api.getResearchGroupTokensByAccountAsync(user.username)
                .then((tokensList) => {
                    const promises = [];
                    for (var i = 0; i < tokensList.length; i++) {
                        const rgt = tokensList[i];
                        groupTokens.push(rgt);
                        promises.push(deipRpc.api.getResearchGroupByIdAsync(rgt.research_group_id))
                    }
                    return Promise.all(promises);
                })
                .then((groups) => {
                    commit('SET_USER_GROUPS_LIST', groups)
                    commit('SET_USER_RESEARCH_GROUP_TOKENS_LIST', groupTokens)
                });
        }
    }
}

// mutations
const mutations = {

    ['SET_USER_EXPERT_TOKENS_LIST'](state, list) {
        Vue.set(state.user, 'expertTokens', list)
    },

    ['SET_USER_DISCIPLINES_LIST'](state, list) {
        Vue.set(state.user, 'disciplines', list)
    },

    ['SET_USER_GROUPS_LIST'](state, list) {
        Vue.set(state.user, 'groups', list)
    },

    ['SET_USER_RESEARCH_GROUP_TOKENS_LIST'](state, list) {
        Vue.set(state.user, 'groupTokens', list)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}