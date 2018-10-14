import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client';
import Vue from 'vue';
import usersService from './../../../services/http/users'

const state = {
    claimerAccount: undefined,
    claimerProfile: undefined
}

// getters
const getters = {
    claimerInfo: (state, getters) => {
        return { account: state.claimerAccount, profile: state.claimerProfile }
    }
}

// actions
const actions = {
    
    loadClaimer({ dispatch, commit }, username) {
        dispatch('loadClaimerAccount', { username });
        dispatch('loadClaimerProfile', { username });

        // Promise.all([accountLoad, profileLoad, researchLoad, expertiseLoad, invitesLoad])
        //     .then(() => {
        //         commit('SET_USER_PROFILE_PAGE_LOADING_STATE', false)
        //     })
    },

    loadClaimerAccount({ commit }, { username }) {
        return deipRpc.api.getAccountsAsync([username])
            .then(data => {
                commit('SET_USER_ACCOUNT', data[0]);
            });
    },

    loadClaimerProfile({ commit },  { username }) {
        return usersService.getUserProfile(username)
            .then((profile) => {
                console.log(profile);
                commit('SET_USER_PROFILE', profile !== "" ? profile : null);
            })
            .catch(err => console.log(err))
            .finally(() => {});
    }
}

// mutations
const mutations = {
    ['SET_USER_ACCOUNT'](state, account) {
        Vue.set(state, 'claimerAccount', account);
    },
    ['SET_USER_PROFILE'](state, profile) {
        Vue.set(state, 'claimerProfile', profile);
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