import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client';
import Vue from 'vue'
import { getAccessToken } from './../../../utils/auth'

const state = {
    success: {isVisible: false, message: ""},
    error: {isVisible: false, message: ""}
}

// getters
const getters = {

    success: (state, getters) => {
        return state.success;
    },
    
    error: (state, getters) => {
        return state.error;
    }
}

// actions
const actions = {

    setError({ state, commit }, error) {
        if (error.isVisible === undefined)
            error.isVisible = true;
        commit('SET_ERROR_SNACK', error)
    },

    setSuccess({ state, commit }, success) {
        if (success.isVisible === undefined)
            success.isVisible = true;
        commit('SET_SUCCESS_SNACK', success)
    }
}

// mutations
const mutations = {

    ['SET_SUCCESS_SNACK'](state, success) {
        Vue.set(state, 'success', success)
    },

    ['SET_ERROR_SNACK'](state, error) {
        Vue.set(state, 'error', error)
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