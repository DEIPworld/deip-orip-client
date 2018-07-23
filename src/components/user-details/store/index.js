import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client';
import Vue from 'vue';
import usersService from './../../../services/users'

const state = {
    account: undefined,
    profile: undefined,
    researchList: [],
    groups: [],
    expertise: [],
    invites:[],

    isLoadingUserProfilePage: undefined,

    isLoadingUserAccount: undefined,
    isLoadingUserProfile: undefined,
    isLoadingUserGroups: undefined,
    isLoadingUserResearch: undefined,
    isLoadingUserExpertise: undefined,
    isLoadingUserInvites: undefined
}

// getters
const getters = {
    userInfo: (state, getters) => {
        return { account: state.account, profile: state.profile }
    },
    researchList: state => state.researchList,
    groups: state => state.groups,
    expertise: state => state.expertise,
    invites: state => state.invites,

    
    isLoadingUserProfilePage: state => state.isLoadingUserProfilePage,

    isLoadingUserAccount: state => state.isLoadingUserAccount,
    isLoadingUserProfile: state => state.isLoadingUserProfile,
    isLoadingUserGroups: state => state.isLoadingUserGroups,
    isLoadingUserResearch: state => state.isLoadingUserResearch,
    isLoadingUserExpertise: state => state.isLoadingUserExpertise,
    isLoadingUserInvites: state => state.isLoadingUserInvites
}

// actions
const actions = {
    
    loadUser({ dispatch, commit }, username) {
        commit('SET_USER_PROFILE_PAGE_LOADING_STATE', true)

        const accountLoad = new Promise((resolve, reject) => {
            dispatch('loadUserAccount', {username: username, notify: resolve });
        });
        const profileLoad = new Promise((resolve, reject) => {
            dispatch('loadUserProfile', {username: username, loading: true, notify: resolve });
        });
        const researchLoad = new Promise((resolve, reject) => {
            dispatch('loadGroups', {username: username })
                .then(() => dispatch('loadResearchList', {username: username, notify: resolve }));
        });
        const expertiseLoad = new Promise((resolve, reject) => {
            dispatch('loadExpertise', {username: username, notify: resolve });
        });
        const invitesLoad = new Promise((resolve, reject) => {
            dispatch('loadUserInvites', {username: username, notify: resolve });
        });
        Promise.all([accountLoad, profileLoad, researchLoad, expertiseLoad, invitesLoad])
            .then(() => {
                commit('SET_USER_PROFILE_PAGE_LOADING_STATE', false)
            })
    },

    loadUserAccount({ commit }, { username, notify }) {
        commit('SET_USER_ACCOUNT_LOADING_STATE', true)

        deipRpc.api.getAccountsAsync([username])
            .then(data => {
                commit('SET_USER_ACCOUNT', data[0]);
            })
            .finally(() => {
                commit('SET_USER_ACCOUNT_LOADING_STATE', false)
                if (notify) notify();
            });
    },

    loadGroups({ commit }, { username, notify }) {
        commit('SET_USER_GROUPS_LOADING_STATE', true)
        
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
            commit('SET_USER_GROUPS_LOADING_STATE', false)
            if (notify) notify();
        });
    },

    loadResearchList({ commit, state }, { username, notify }) {
        commit('SET_USER_RESEARCH_LOADING_STATE', true)

        // researhes where user took participation 
        let researchList = [];

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
            commit('SET_USER_RESEARCH_LOADING_STATE', false)
            if (notify) notify();
        });
    },

    loadExpertise({ commit }, { username, notify }) {
        commit('SET_USER_EXPERTISE_LOADING_STATE', true)

        deipRpc.api.getExpertTokensByAccountNameAsync(username)
            .then(data => {
                commit('SET_EXPERTISE', data);
            }).finally(() => {
                commit('SET_USER_EXPERTISE_LOADING_STATE', false)
                if (notify) notify();
            });
    },

    loadUserProfile({ commit },  { username, loading, notify }) {
        if (loading) commit('SET_USER_PROFILE_LOADING_STATE', true)

        usersService.getUserProfile(username)
            .then((profile) => { 
                commit('SET_USER_PROFILE', profile != "" ? profile : null);
            }, (err) => {
                console.log(err)
            }).finally(() => {
                if (loading) commit('SET_USER_PROFILE_LOADING_STATE', false)
                if (notify) notify();
            });
    },

    loadUserInvites({ commit }, { username, notify }) {
        commit('SET_USER_INVITES_LOADING_STATE', true)

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
                commit('SET_USER_INVITES_LOADING_STATE', false)
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
    },

    ['SET_USER_ACCOUNT_LOADING_STATE'](state, value) {
        state.isLoadingUserAccount = value;
    },

    ['SET_USER_PROFILE_LOADING_STATE'](state, value) {
        state.isLoadingUserProfile = value;
    },

    ['SET_USER_GROUPS_LOADING_STATE'](state, value) {
        state.isLoadingUserGroups = value;
    },

    ['SET_USER_RESEARCH_LOADING_STATE'](state, value) {
        state.isLoadingUserResearch = value;
    },

    ['SET_USER_EXPERTISE_LOADING_STATE'](state, value) {
        state.isLoadingUserExpertise = value;
    },
    
    ['SET_USER_INVITES_LOADING_STATE'](state, value) {
        state.isLoadingUserInvites = value;
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