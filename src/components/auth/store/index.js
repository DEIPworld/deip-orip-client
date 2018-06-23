import _ from 'lodash';
import deipRpc from '@deip/deip-rpc';
import Vue from 'vue'

import { isLoggedIn, getDecodedToken, getOwnerWif } from './../../../utils/auth'
import usersService from './../../../services/users'
import joinRequestsService from './../../../services/joinRequests'

const state = {
    user: {
        username: isLoggedIn() ? getDecodedToken().username : null,
        pubKey: isLoggedIn() ? getDecodedToken().pubKey : null,
        privKey: isLoggedIn() ? getOwnerWif() : null,
        profile: null,
        account: null,
        expertTokens: [],
        groupTokens: [],
        disciplines: [],
        groups: [],
        coworkers: [],
        joinRequests: []
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
                rgtId: rgt.id,
                is_personal: group.is_personal
            })
        }
        return groups;
    },

    userIsResearchGroupMember: (state, getters) => {
        return groupId => getters.userGroups.find(group => {
            return groupId === group.id}) !== undefined;
    },

    userCoworkers: (state, getters) => {
        return state.user.coworkers;
    },

    userJoinRequests: (state, getters) => {
        return state.user.joinRequests;
    }
}

// actions
const actions = {

    loadUser({state, dispatch}){
        dispatch('loadExpertTokens');
        dispatch('loadGroups');
        dispatch('loadProfile');
        dispatch('loadJoinRequests');
    },

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

    loadProfile({ state, commit, getters }) {
        const user = getters.user;

        if (user.username) {
            usersService.getUserProfile(user.username)
            .then((profile) => {
                if (profile === "") { // revise this once we've got 'approve' operation working
                    usersService.createUserProfile(user.username, {})
                        .then((newProfile) => {
                            commit('SET_USER_PROFILE', newProfile)
                        }, (err) => {
                            console.log(err);
                        })
                } else {
                    commit('SET_USER_PROFILE', profile)
                }
            }, (err) => {
                console.log(err);
            })
        }
    },

    loadGroups({ state, dispatch, commit, getters }) {
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
                    
                    // todo: move it to specific scope
                    dispatch('loadCoworkers')
                });
        }
    },

    loadCoworkers({ state, commit, getters }, groupId) {
        const groups = getters.userGroups;
        const coworkers = [];

        if (groups.length) {

            var promises = [];
            for (var i = 0; i < groups.length; i++) {
                const group = groups[i];
                promises.push(deipRpc.api.getResearchGroupTokensByResearchGroupAsync(group.id))
            }

            Promise.all(promises)
                .then((tokensList) => {

                    const flattened = tokensList.reduce(
                        function(accumulator, currentValue) {
                            return accumulator.concat(currentValue);
                        }, []);

                        for (var i = 0; i < flattened.length; i++) {
                            const rgt = flattened[i]
                            if(rgt.owner != state.user.username 
                                && coworkers.find(c => {return c.owner == rgt.owner}) == undefined){

                                coworkers.push(rgt);
                            }
                        }
                        
                        commit('SET_USER_COWORKERS_LIST', coworkers)
                });
        }
    },

    loadJoinRequests({ state, commit, getters }) {
        const user = getters.user;
        if (user.username) {
            joinRequestsService.getJoinRequestsByUser(user.username)
                .then((requests) => {
                    commit('SET_USER_JOIN_REQUESTS', requests)
                }, (err) => {
                    console.log(err)
                })
        }
    },

    loadAccount({ state, commit, getters }) {
        const user = getters.user;
        if (user.username) {
            deipRpc.api.getAccountsAsync([user.username])
                .then((account) => {
                    commit('SET_USER_ACCOUNT', account)
                }, (err) => {
                    console.log(err)
                })
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
    },

    ['SET_USER_COWORKERS_LIST'](state, list) {
        Vue.set(state.user, 'coworkers', list)
    },

    ['SET_USER_PROFILE'](state, profile) {
        Vue.set(state.user, 'profile', profile)
    },

    ['SET_USER_JOIN_REQUESTS'](state, requests) {
        Vue.set(state.user, 'joinRequests', requests)
    },

    ['SET_USER_ACCOUNT'](state, account) {
        Vue.set(state.user, 'account', account)
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