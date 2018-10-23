import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client';
import Vue from 'vue';
import usersService from './../../../services/http/users'
import { getEnrichedProfiles } from './../../../utils/user'
import expertiseClaimsService from '../../../services/http/expertiseClaims.js';
import * as disciplineTreeService from '../../common/disciplines/DisciplineTreeService.js'

const state = {
    claimerAccount: undefined,
    claimerProfile: undefined,
    claimerExpertise: undefined,
    claim: undefined,
    proposals: undefined
}

// getters
const getters = {
    claimerInfo: (state, getters) => {
        return {
            account: state.claimerAccount,
            profile: state.claimerProfile,
            expertise: state.claimerExpertise
        }
    },
    claim: (state, getters) => state.claim,
    proposals: (state, getters) => state.proposals
}

// actions
const actions = {
    
    loadClaimer({ dispatch, commit, state }, { username, claimId }) {
        const loadClaimerAccount = dispatch('loadClaimerAccount', { username });
        const loadClaimerProfile = dispatch('loadClaimerProfile', { username });
        const loadClaimerExpertise = dispatch('loadClaimerExpertise', { username });

        const loadClaim = dispatch('loadClaim', { username, claimId })
            .then(() => {
                return dispatch('loadClaimProposals', { username, disciplineId: state.claim.disciplineId });
            });

        return Promise.all([loadClaimerAccount, loadClaimerProfile, loadClaimerExpertise, loadClaim]);
    },

    loadClaimerAccount({ commit }, { username }) {
        return deipRpc.api.getAccountsAsync([username])
            .then(data => {
                commit('SET_CLAIMER_ACCOUNT', data[0]);
            });
    },

    loadClaimerProfile({ commit },  { username }) {
        return usersService.getUserProfile(username)
            .then((profile) => {
                commit('SET_CLAIMER_PROFILE', profile !== "" ? profile : null);
            })
            .catch(err => console.log(err));
    },

    loadClaimerExpertise({ commit }, { username }) {
        return deipRpc.api.getExpertTokensByAccountNameAsync(username)
            .then(expertise => {
                commit('SET_CLAIMER_EXPERTISE', expertise);
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
    },

    loadClaimProposals({ commit }, { username, disciplineId }) {
        let resProposals = [];

        return deipRpc.api.getExpertiseAllocationProposalsByClaimerAndDisciplineAsync(username, disciplineId)
            .then(proposals => {
                resProposals = proposals;

                const disciplinesPromise = Promise.all(
                    resProposals.map(item => deipRpc.api.getDisciplineAsync(item.discipline_id))
                );

                const profilesPromise = getEnrichedProfiles(
                    resProposals.map(item => item.initiator)
                );

                const expertTokensPromise = Promise.all(
                    resProposals.map(item => deipRpc.api.getExpertTokensByAccountNameAsync(item.initiator))
                );

                return Promise.all([
                    disciplinesPromise,
                    profilesPromise,
                    expertTokensPromise
                ]);
            })
            .then(([disciplines, profiles, expertTokens]) => {
                resProposals.forEach((proposal, index) => {
                    proposal.discipline = disciplines[index];
                    proposal.initiatorInfo = profiles[index];
                    proposal.initiatorExpertise = expertTokens[index];
                });

                commit('SET_PROPOSALS', resProposals);

                return resProposals;
            })
            .catch(err => console.log(err));
    }
}

// mutations
const mutations = {
    ['SET_CLAIMER_ACCOUNT'](state, account) {
        Vue.set(state, 'claimerAccount', account);
    },
    ['SET_CLAIMER_PROFILE'](state, profile) {
        Vue.set(state, 'claimerProfile', profile);
    },
    ['SET_CLAIM'](state, claim) {
        Vue.set(state, 'claim', claim)
    },
    ['SET_PROPOSALS'](state, proposals) {
        Vue.set(state, 'proposals', proposals)
    },
    ['SET_CLAIMER_EXPERTISE'](state, expertise) {
        Vue.set(state, 'claimerExpertise', expertise);
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