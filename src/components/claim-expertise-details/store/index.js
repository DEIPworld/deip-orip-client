import _ from 'lodash';
import deipRpc from '@deip/deip-oa-rpc-client';
import Vue from 'vue';
import usersService from './../../../services/http/users'
import { getEnrichedProfiles } from './../../../utils/user'
import expertiseClaimsService from '../../../services/http/expertiseClaims.js';
import * as disciplineTreeService from '../../common/disciplines/DisciplineTreeService.js'

const state = {
    claimerAccount: undefined,
    claimerProfile: undefined,
    claimerExpertise: [],
    claim: undefined,
    proposal: undefined
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
    proposal: (state, getters) => state.proposal
}

// actions
const actions = {
    
    loadClaimer({ dispatch, commit, state }, { username, claimId }) {
        const loadClaimerAccount = dispatch('loadClaimerAccount', { username });
        const loadClaimerProfile = dispatch('loadClaimerProfile', { username });
        const loadClaimerExpertise = dispatch('loadClaimerExpertise', { username });

        const loadClaim = dispatch('loadClaim', { username, claimId })
            .then(() => {
                return dispatch('loadClaimProposal', { username, disciplineId: state.claim.disciplineId });
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
                    return deipRpc.api.getDisciplineAsync(claim.disciplineId)
                        .then(discipline => {
                            claim.discipline = discipline;
                            commit('SET_CLAIM', claim);
                        });
                } else {
                    commit('SET_CLAIM', claim);
                }

            })
            .catch(err => console.log(err));
    },

    loadClaimProposal({ commit }, { username, disciplineId }) {
        let resProposal = [];

        return deipRpc.api.getExpertiseAllocationProposalsByClaimerAndDisciplineAsync(username, disciplineId)
            .then(proposal => {
                resProposal = proposal;

                return Promise.all([
                    deipRpc.api.getDisciplineAsync(resProposal.discipline_id),
                    deipRpc.api.getExpertiseAllocationProposalVotesByExpertiseAllocationProposalIdAsync(resProposal.id),
                ]);
            })
            .then(([discipline, proposalVotes]) => {
                resProposal.discipline = discipline;
                resProposal.votes = proposalVotes;

                commit('SET_PROPOSAL', resProposal);

                return resProposal;
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
    ['SET_PROPOSAL'](state, proposal) {
        Vue.set(state, 'proposal', proposal)
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