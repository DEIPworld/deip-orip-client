import _ from 'lodash';
import deipRpc from '@deip/deip-rpc';
import Vue from 'vue';

const state = {
    account: undefined
}

// getters
const getters = {
    account: state => state.account
}

// actions
const actions = {
    loadUser({ commit }, accountName) {
        return deipRpc.api.getAccountsAsync([accountName])
            .then(data => {
                commit('SET_ACCOUNT', data[0]);

                return !_.isEmpty(data) ? data[0] : undefined;
            });
    }
}

// mutations
const mutations = {
    ['SET_ACCOUNT'](state, account) {
        Vue.set(state, 'account', account);
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