import _ from 'lodash';
import deipRpc from '@deip/deip-rpc';
import Vue from 'vue'

const state = {
    research: null,
    tokenSale: null,
    contributionsList: []
}


// getters
const getters = {
    research: (state, getters) => {
        return state.research;
    },

    tokenSale: (state, getters) => {
        return state.tokenSale;
    },

    contributionsList: (state, getters) => {
        return state.contributionsList;
    }
}

// actions
const actions = {
    loadTokeSaleDetails({ state, commit }, { group_permlink, research_permlink }) {
        deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)
            .then((research) => {
                research.group_permlink = group_permlink;
                commit('SET_RESEARCH_DETAILS', research)
                return deipRpc.api.checkResearchTokenSaleExistenceByResearchIdAsync(research.id)
            })
            .then((exists) => {
                debugger;
                if (exists) {
                    deipRpc.api.getResearchTokenSaleByResearchIdAsync(state.research.id)
                      .then((tokenSale) => {
                            commit('SET_RESEARCH_TOKEN_SALE', tokenSale)
                            return deipRpc.api.getResearchTokenSaleContributionsByResearchTokenSaleIdAsync(state.tokenSale.id)
                      })
                      .then((contributions) => {
                            commit('SET_RESEARCH_TOKEN_SALE_CONTRIBUTIONS_LIST', contributions)
                    });
                }
            })
    }

}

// mutations
const mutations = {
    ['SET_RESEARCH_DETAILS'](state, research) {
        Vue.set(state, 'research', research)
    },

    ['SET_RESEARCH_TOKEN_SALE'](state, tokenSale) {
        Vue.set(state, 'tokenSale', tokenSale)
    },

    ['SET_RESEARCH_TOKEN_SALE_CONTRIBUTIONS_LIST'](state, contributions) {
        Vue.set(state, 'contributionsList', contributions)
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