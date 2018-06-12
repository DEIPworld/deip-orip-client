import _ from 'lodash';
import deipRpc from '@deip/deip-rpc';
import Vue from 'vue';

const state = {
    account: undefined,
    researches: [],
    commonTokensBalance: undefined
}

// getters
const getters = {
    account: state => state.account,
    researches: state => state.researches,
    commonTokensBalance: state => state.commonTokensBalance
}

// actions
const actions = {
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

        deipRpc.api.getResearchTokensByAccountNameAsync(accountName)
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
            }).finally(() => {
                commit('SET_RESEARCHES', userResearches);
            });
    },
    loadCommonTokens({ commit }, accountName) {
        deipRpc.api.getExpertTokensByDisciplineIdAsync(0)
            .then(commonTokens => {
                let result = commonTokens.find(item => item.account_name === accountName);
                commit('SET_COMMON_TOKEN_BALANCE', result ? result.amount : 0);
            });
    }
}

// mutations
const mutations = {
    ['SET_ACCOUNT'](state, account) {
        Vue.set(state, 'account', account);
    },
    ['SET_RESEARCHES'](state, researches) {
        Vue.set(state, 'researches', researches);
    },
    ['SET_COMMON_TOKEN_BALANCE'](state, commonTokensBalance) {
        Vue.set(state, 'commonTokensBalance', commonTokensBalance);
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