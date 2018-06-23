import _ from 'lodash';
import deipRpc from '@deip/deip-rpc';
import Vue from 'vue';
import usersService from './../../../services/users'

const state = {
    account: undefined,
    profile: undefined,
    researchList: [],
    groups: [],
    expertise: [],
    invites:[]
}

// getters
const getters = {
    userInfo: (state, getters) => {
        return { account: state.account, profile: state.profile }
    },
    researchList: state => state.researchList,
    groups: state => state.groups,
    expertise: state => state.expertise,
    invites: state => state.invites
}

// actions
const actions = {
    loadUser({ dispatch }, accountName) {
        dispatch('loadUserAccount', accountName);
        dispatch('loadExpertise', accountName);

        dispatch('loadGroups', accountName).then(() => 
            dispatch('loadResearchList', accountName)
        );
        dispatch('loadUserProfile', accountName);
        dispatch('loadUserInvites', accountName);
    },
    loadUserAccount({ commit }, accountName) {
        deipRpc.api.getAccountsAsync([accountName]).then(data => {
            commit('SET_USER_ACCOUNT', data[0]);
        });
    },
    loadResearchList({ commit, state }, accountName) {
        // researhes where user took participation 
        let researchList = [];

        // OMG pzdc, so many queries, very optimized blockchains...

        return Promise.all(
            state.groups.map(group => deipRpc.api.getAllResearchContentAsync(group.id))
        )
        .then(data => {
            let researchPromises = _(data)
                .flatten()
                .filter(item => _.includes(item.authors, accountName))
                .map('research_id')
                .uniq()
                .map(researchId => deipRpc.api.getResearchByIdAsync(researchId))
                .value();

            return Promise.all(researchPromises);
        })
        .then(researches => {
            researchList = researches;

            return Promise.all(
                researchList.map(item => deipRpc.api.getTotalVotesByResearchAsync(item.research_id))
            );
        })
        .then(list => {
            let tvoMap = _.chain(list)
                .flatten()
                .groupBy('research_id')
                .value();

            researchList.forEach(research => {
                research.totalVotes = tvoMap[research.id] ? tvoMap[research.id] : [];
            });

            return researchList;
        })
        .then(data => {
            commit('SET_RESEARCH_LIST', data);
        }).catch(() => {
            commit('SET_RESEARCH_LIST', researchList);
        });;
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
        });
    },
    loadUserProfile({ commit }, username) {
        usersService.getUserProfile(username)
            .then((profile) => { 
                commit('SET_USER_PROFILE', profile != "" ? profile : null);
            }, (err) => {
                console.log(err)
            })
    },

    loadUserInvites({ commit }, username) {
        const invites = [];
        deipRpc.api.getResearchGroupInvitesByAccountNameAsync(username)
            .then((list) => {
                const promises = [];
                for (let i = 0; i < list.length; i++) {
                    const invite = list[i];
                    invites.push(invite);
                    promises.push(deipRpc.api.getResearchGroupByIdAsync(invite.research_group_id))
                }
                return Promise.all(promises);
            }, (err) => {
                console.log(err)
            })
            .then((groups) => {
                for (let i = 0; i < invites.length; i++) {
                    const invite = invites[i];
                    invite.group = groups.find(g => g.id == invite.research_group_id)
                }
                commit('SET_USER_INVITES', invites);
            })
    }
}

// mutations
const mutations = {
    
    ['SET_USER_ACCOUNT'](state, account) {
        Vue.set(state, 'account', account);
    },

    ['SET_RESEARCH_LIST'](state, researchList) {
        Vue.set(state, 'researchList', researchList);
    },

    ['SET_RESEARCH_GROUPS'](state, groups) {
        Vue.set(state, 'groups', groups);
    },

    ['SET_EXPERTISE'](state, expertise) {
        Vue.set(state, 'expertise', expertise);
    },

    ['SET_USER_PROFILE'](state, profile) {
        Vue.set(state, 'profile', profile);
    },
    
    ['SET_USER_INVITES'](state, invites) {
        Vue.set(state, 'invites', invites);
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