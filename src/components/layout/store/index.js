import _ from 'lodash';
import Vue from 'vue'

const state = {
    success: { isVisible: false, message: "" },
    error: { isVisible: false, message: "" },

    globalLoader: { isLoading: false }
}

// getters
const getters = {
    success: (state, getters) => state.success,
    error: (state, getters) => state.error,

    globalLoader: (state, getters) => state.globalLoader
}

// actions
const actions = {

    setError({ state, commit }, error) {
        if (error.isVisible === undefined) {
            error.isVisible = true;
        }

        commit('SET_ERROR_SNACK', error)
    },

    setSuccess({ state, commit }, success) {
        if (success.isVisible === undefined) {
            success.isVisible = true;
        }

        commit('SET_SUCCESS_SNACK', success)
    },

    setGlobalLoader({ state, commit }) {
        commit('CHANGE_GLOBAL_LOADER_FIELD', { field: 'isLoading', value: true });
    },

    hideGlobalLoader({ state, commit }) {
        commit('CHANGE_GLOBAL_LOADER_FIELD', { field: 'isLoading', value: false });
    }
}

// mutations
const mutations = {

    ['SET_SUCCESS_SNACK'](state, success) {
        Vue.set(state, 'success', success);
    },

    ['SET_ERROR_SNACK'](state, error) {
        Vue.set(state, 'error', error);
    },

    ['CHANGE_GLOBAL_LOADER_FIELD'](state, payload) {
        Vue.set(state.globalLoader, payload.field, payload.value);
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