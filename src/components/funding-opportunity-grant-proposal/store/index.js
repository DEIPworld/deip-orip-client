import Vue from 'vue';
import deipRpc from '@deip/deip-rpc-client';
import agencyHttp from './../../../services/http/agency';
import applicationHttp from './../../../services/http/application';
import { mapAreaToProgram } from '../../common/disciplines/DisciplineTreeService'
import { getEnrichedProfiles } from './../../../utils/user';

const state = {
    agency: undefined,
    program: undefined,

    isLoadingAgencyProgramDetailsPage: undefined,
    isLoadingAgencyProgramDetails: undefined,
}

// getters
const getters = {
    agency: (state, getters) => state.agency,
    program: (state, getters) => state.program,
    
    isLoadingAgencyProgramDetailsPage: (state, getters) => state.isLoadingAgencyProgramDetailsPage !== false
}

// actions
const actions = {
    loadProgramGrantProposalPage({ state, dispatch, commit }, { agency, foaId }) {
        commit('SET_AGENCY_PROGRAM_DETAILS_PAGE_LOADING_STATE', true);
        return agencyHttp.getAgencyProfile(agency)
            .then((agencyProfile) => {
                commit('SET_AGENCY_PROFILE', agencyProfile);
                const agencyProgramDetailsLoad = new Promise((resolve, reject) => {
                    dispatch('loadProgramDetails', { foaId })
                        .then(() => {

                            resolve();
                        });
                });
                return Promise.all([agencyProgramDetailsLoad])
            })
            .catch(err => { console.log(err) })
            .finally(() => {
                commit('SET_AGENCY_PROGRAM_DETAILS_PAGE_LOADING_STATE', false);
            });
    },

    loadProgramDetails({ state, dispatch, commit }, { foaId, notify }) {
        commit('SET_AGENCY_PROGRAM_LOADING_STATE', true);

        var program;
        return deipRpc.api.getFundingOpportunitiesByOpportunityNumberAsync(foaId)
            .then((programs) => {
                program = programs.find(p => p.agency_name == state.agency._id);
                return getEnrichedProfiles(program.officers);
            })
            .then((profiles) => {
                program.officers = profiles
                commit('SET_AGENCY_PROGRAM', program);
            })
            .catch(err => { console.log(err) })
            .finally(() => {
                commit('SET_AGENCY_PROGRAM_LOADING_STATE', false);
                if (notify) notify();
            });
    }
}

// mutations
const mutations = {

    ['SET_AGENCY_PROFILE'](state, agency) {
        Vue.set(state, 'agency', agency)
    },

    ['SET_AGENCY_PROGRAM'](state, program) {
        mapAreaToProgram(program, state.agency.researchAreas);
        Vue.set(state, 'program', program)
    },

    ['SET_AGENCY_PROGRAM_LOADING_STATE'](state, isLoading) {
        Vue.set(state, 'isLoadingAgencyProgramDetails', isLoading)
    },

    ['SET_AGENCY_PROGRAM_DETAILS_PAGE_LOADING_STATE'](state, isLoading) {
        Vue.set(state, 'isLoadingAgencyProgramDetailsPage', isLoading)
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