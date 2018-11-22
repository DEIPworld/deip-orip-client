import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client';
import Vue from 'vue';

const state = {
    account: undefined,
    researches: []
};

// getters
const getters = {
    account: state => state.account,
    researches: state => state.researches
};

// actions
const actions = {
    loadWallet({ dispatch }, accountName) {
        return Promise.all([
            dispatch('loadUser', accountName),
            dispatch('loadResearchTokens', accountName)
        ]);
    },

    loadUser({ commit }, accountName) {
        return deipRpc.api.getAccountsAsync([accountName])
            .then(data => {
                commit('SET_ACCOUNT', data[0]);

                return data[0];
            });
    },

    loadResearchTokens({ commit }, accountName) {
        let userResearches = [];
        let researchTokens = [];

        return deipRpc.api.getResearchTokensByAccountNameAsync(accountName)
            .then(tokens => {
                researchTokens = tokens;

                return Promise.all(
                    researchTokens.map(researchToken => deipRpc.api.getResearchByIdAsync(researchToken.research_id))
                );
            }).then(researches => {
                let promises = [];
                userResearches = researches;

                userResearches.forEach((research, i) => {
                    research.researchToken = researchTokens[i];
                    
                    promises.push(
                        deipRpc.api.getResearchGroupTokensByResearchGroupAsync(research.research_group_id)
                    );
                });

                return Promise.all(promises);
            }).then(groupsTokensArray => {
                userResearches.forEach((research, i) => { research.groupTokens = groupsTokensArray[i] });

                commit('SET_RESEARCHES', userResearches);
            });
    }
};

// mutations
const mutations = {
    ['SET_ACCOUNT'](state, account) {
        Vue.set(state, 'account', account);
    },
    ['SET_RESEARCHES'](state, researches) {
        Vue.set(state, 'researches', researches);
    }
};

const namespaced = true;

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations
};
