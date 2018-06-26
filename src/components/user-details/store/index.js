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
    
    loadUser({ dispatch, commit }, username) {
        commit('SET_USER_PROFILE_PAGE_LOADING_STATE', true)

        const contentLoad = new Promise((resolve, reject) => {
            dispatch('loadUserAccount', {username: username, notify: resolve });
        });
        const expertiseLoad = new Promise((resolve, reject) => {
            dispatch('loadExpertise', {username: username, notify: resolve });
        });
        const researchLoad = new Promise((resolve, reject) => {
            dispatch('loadGroups', {username: username })
                .then(() => dispatch('loadResearchList', {username: username, notify: resolve }));
        });
        const profileLoad = new Promise((resolve, reject) => {
            dispatch('loadUserProfile', {username: username, notify: resolve });
        });
        const invitesLoad = new Promise((resolve, reject) => {
            dispatch('loadUserInvites', {username: username, notify: resolve });
        });
        Promise.all([contentLoad, expertiseLoad, researchLoad, profileLoad, invitesLoad])
            .then(() => {
                commit('SET_USER_PROFILE_PAGE_LOADING_STATE', false)
            })
    },

    loadUserAccount({ commit }, { username, notify }) {
        deipRpc.api.getAccountsAsync([username])
            .then(data => {
                commit('SET_USER_ACCOUNT', data[0]);
            })
            .finally(() => {
                if (notify) notify();
            });
    },

    loadResearchList({ commit, state }, { username, notify }) {
        // researhes where user took participation 
        let researchList = [];

        // OMG pzdc, so many queries, very optimized blockchains...

        return Promise.all(
            state.groups.map(group => deipRpc.api.getAllResearchContentAsync(group.id))
        )
        .then(data => {
            let researchPromises = _(data)
                .flatten()
                .filter(item => _.includes(item.authors, username))
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
        })
        .finally(() => {

            if (notify) notify();
        });
    },

    loadGroups({ commit }, { username, notify }) {
        return deipRpc.api.getResearchGroupTokensByAccountAsync(username).then(data => {
            let groupsInfo = Promise.all(
                data.map(groupToken => deipRpc.api.getResearchGroupByIdAsync(groupToken.research_group_id))
            );

            let groupsShares = Promise.all(
                data.map(groupToken => deipRpc.api.getResearchGroupTokensByResearchGroupAsync(groupToken.research_group_id))
            );

            return Promise.all([groupsInfo, groupsShares]);
        })
        .then(([groupsInfo, groupsShares]) => {
            let groups = _.each(groupsInfo, (item, i) => { item.shares = groupsShares[i] });
            commit('SET_RESEARCH_GROUPS', groups);
        })
        .finally(() => {
            if (notify) notify();
        });
    },

    loadExpertise({ commit }, { username, notify }) {
        return deipRpc.api.getExpertTokensByAccountNameAsync(username)
            .then(data => {
                commit('SET_EXPERTISE', data);
            }).finally(() => {
                if (notify) notify();
            });
    },

    loadUserProfile({ commit },  { username, notify }) {
        usersService.getUserProfile(username)
            .then((profile) => { 
                commit('SET_USER_PROFILE', profile != "" ? profile : null);
            }, (err) => {
                console.log(err)
            }).finally(() => {
                if (notify) notify();
            });
    },

    loadUserInvites({ commit }, { username, notify }) {
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
            }).finally(() => {

                if (notify) notify();
            });
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
    },

    ['SET_USER_PROFILE_PAGE_LOADING_STATE'](state, value) {
        state.isLoadingUserProfilePage = value;
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