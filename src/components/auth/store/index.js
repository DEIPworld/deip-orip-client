import _ from 'lodash';
import deipRpc from '@deip/deip-rpc';
import Vue from 'vue'

import { isLoggedIn, getDecodedToken, getOwnerWif } from './../../../utils/auth'

const state = {
    user: {
        username: isLoggedIn() ? getDecodedToken().username : null,
        pubKey: isLoggedIn() ? getDecodedToken().pubKey : null,
        privKey: isLoggedIn() ? getOwnerWif() : null,
        expertTokens: [],
        disciplines: []
    }
}

// getters
const getters = {
    user: (state, getters) => {
        return state.user
    },
    userExperise: (state, getters) => {
        const experise = [];
        for (let i = 0; i < state.user.expertTokens.length; i++) {
            const exp = state.user.expertTokens[i];
            const discipline = state.user.disciplines.find(d => { return d.id == exp.discipline_id });
            exp.discipline_name = discipline.name;
            experise.push(exp);
        }
        return experise;
    }
}

// actions
const actions = {

    loadExpertTokens({ state, commit, getters }) {
        const user = getters.user;
        const expertTokens = [];

        if (user.username) {
            deipRpc.api.getExpertTokensByAccountNameAsync(user.username)
                .then((data) => {
                    const promises = [];
                    for (var i = 0; i < data.length; i++) {
                        var exp = data[i];
                        expertTokens.push(exp);
                        promises.push(deipRpc.api.getDisciplineAsync(exp.discipline_id))
                    }
                    return Promise.all(promises);
                })
                .then((list) => {
                    commit('SET_USER_DISCIPLINES_LIST', list)
                    commit('SET_USER_EXPERT_TOKENS_LIST', expertTokens)
                });
        }
    }
}

// mutations
const mutations = {
    ['SET_USER_EXPERT_TOKENS_LIST'](state, list) {
        Vue.set(state.user, 'expertTokens', list)
    },

    ['SET_USER_DISCIPLINES_LIST'](state, list) {
        Vue.set(state.user, 'disciplines', list)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}