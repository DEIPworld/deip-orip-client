import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client';
import Vue from 'vue';
import usersService from './../../../services/http/users'
import expertiseClaimsService from '../../../services/http/expertiseClaims.js';
import * as disciplineTreeService from '../../common/disciplines/DisciplineTreeService.js'

const state = {
    claimerAccount: undefined,
    claimerProfile: undefined,
    claim: undefined
}

// getters
const getters = {
    claimerInfo: (state, getters) => {
        return { account: state.claimerAccount, profile: state.claimerProfile }
    },
    claim: (state, getters) => state.claim
}

// actions
const actions = {
    
    loadClaimer({ dispatch, commit }, { username, claimId }) {
        dispatch('loadClaimerAccount', { username });
        dispatch('loadClaimerProfile', { username });
        dispatch('loadClaim', { username, claimId });

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
            .catch(err => console.log(err));
    },

    loadClaim({ commit }, { username, claimId }) {
        return expertiseClaimsService.getExpertiseClaimsByUser(username)
            .then(claims => {
                const claim = _.find(claims, { _id: claimId });

                if (claim) {
                    claim.discipline = disciplineTreeService.getNodeById(claim.disciplineId);
                }

                commit('SET_CLAIM', claim);
            })
            .catch(err => console.log(err));
    }
}

// mutations
const mutations = {
    ['SET_USER_ACCOUNT'](state, account) {
        Vue.set(state, 'claimerAccount', account);
    },
    ['SET_USER_PROFILE'](state, profile) {
        Vue.set(state, 'claimerProfile', profile);
    },
    ['SET_CLAIM'](state, claim) {
        Vue.set(state, 'claim', claim)
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