import _ from 'lodash';
import Vue from 'vue';
import deipRpc from '@deip/deip-rpc-client';
import agencyHttp from './../../../services/http/agency';

const state = {
    profile: undefined,
    isLoadingAgencyProfile: undefined
}

// getters
const getters = {

    profile: (state, getters) => {
        return state.profile;
    }
}

// actions
const actions = {

    loadAgencyProfile({ state, dispatch, commit }, { agency }) {
        commit('SET_AGENCY_PROFILE_LOADING_STATE', true);

        agencyHttp.getAgencyProfile(agency)
            .then((agencyProfile) => {
                commit('SET_AGENCY_PROFILE', agencyProfile);
            })
            .catch(err => { console.log(err) })
            .finally(() => {
                commit('SET_AGENCY_PROFILE_LOADING_STATE', false)
            });
    }
}

// mutations
const mutations = {

    ['SET_AGENCY_PROFILE'](state, agency) {
        Vue.set(state, 'profile', agency)
    },

    ['SET_AGENCY_PROFILE_LOADING_STATE'](state, isLoading) {
        Vue.set(state, 'isLoadingAgencyProfile', isLoading)
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