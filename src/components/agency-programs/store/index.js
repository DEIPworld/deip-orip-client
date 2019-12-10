import Vue from 'vue';
import deipRpc from '@deip/deip-oa-rpc-client';
import tenantHttp from './../../../services/http/tenant';
import { mapAreaToProgram } from '../../common/disciplines/DisciplineTreeService'

const state = {
    agency: undefined,
    selectedArea: undefined,

    corePrograms: [],
    additionalPrograms: [],

    isLoadingAgencyProgramsPage: undefined,

    isLoadingAgencyPrograms: undefined
}

// getters
const getters = {
    agency: (state, getters) => state.agency,
    selectedArea: (state, getters) => state.selectedArea,
    
    corePrograms: (state, getters) => state.corePrograms,
    additionalPrograms: (state, getters) => state.additionalPrograms,

    isLoadingAgencyProgramsPage: (state, getters) => state.isLoadingAgencyProgramsPage !== false,
}

// actions
const actions = {

    // pages
    loadAgencyProgramsPage({ state, dispatch, commit }, { agency, areaCode, subAreaCode }) {
        commit('SET_AGENCY_PROGRAMS_LISTING_PAGE_LOADING_STATE', true);
        return tenantHttp.getTenantProfile(agency)
            .then((agencyProfile) => {
                commit('SET_AGENCY_PROFILE', agencyProfile);
                const agencyProgramsLoad = new Promise((resolve, reject) => {
                    dispatch('loadAgencyPrograms', { notify: resolve });
                });
                return Promise.all([agencyProgramsLoad])
            })
            .then(() => {
                if (areaCode && subAreaCode ) {
                    let area = state.agency.researchAreas.find(a => a.abbreviation == areaCode);
                    let subArea = area.subAreas.find(a => a.abbreviation == subAreaCode);
                    commit('SET_RESEARCH_AREA', { area, subArea });
                } else {
                    let area = state.agency.researchAreas[0];
                    let subArea = area.subAreas[0];
                    commit('SET_RESEARCH_AREA', { area, subArea });
                }
            })
            .catch(err => { console.log(err) })
            .finally(() => {
                commit('SET_AGENCY_PROGRAMS_LISTING_PAGE_LOADING_STATE', false)
            });
    },


    loadAgencyPrograms({ state, dispatch, commit }, { notify }) {
        commit('SET_AGENCY_PROGRAMS_LOADING_STATE', true);

            deipRpc.api.getFundingOpportunitiesByAgencyNameAsync(window.env.TENANT)
                .then((programs) => {
                    console.log(programs);
                    const corePrograms = programs;
                    commit('SET_AGENCY_PROGRAMS', { corePrograms, additionalPrograms: [] });
                })
                .catch(err => { console.log(err) })
                .finally(() => {
                    commit('SET_AGENCY_PROGRAMS_LOADING_STATE', false);
                    if (notify) notify();
                });
    },

    setResearchArea({ state, dispatch, commit }, { area, subArea }) {
        commit('SET_RESEARCH_AREA', { area, subArea });
    }
}

// mutations
const mutations = {

    ['SET_AGENCY_PROFILE'](state, agency) {
        Vue.set(state, 'agency', agency)
    },

    ['SET_RESEARCH_AREA'](state, { area, subArea }) {
        Vue.set(state, 'selectedArea', {
            title: area.title,
            abbreviation: area.abbreviation,
            subAreaTitle: subArea.title,
            subAreaAbbreviation: subArea.abbreviation,
            disciplines: subArea.disciplines
        });
    },

    ['SET_AGENCY_PROGRAMS'](state, { corePrograms, additionalPrograms }) {
        corePrograms.forEach(p => { mapAreaToProgram(p, state.agency.researchAreas) });
        additionalPrograms.forEach(p => { mapAreaToProgram(p, state.agency.researchAreas) });

        Vue.set(state, 'corePrograms', corePrograms);
        Vue.set(state, 'additionalPrograms', additionalPrograms)
    },

    ['SET_AGENCY_PROGRAMS_LOADING_STATE'](state, isLoading) {
        Vue.set(state, 'isLoadingAgencyPrograms', isLoading)
    },

    ['SET_AGENCY_PROGRAMS_LISTING_PAGE_LOADING_STATE'](state, isLoading) {
        Vue.set(state, 'isLoadingAgencyProgramsPage', isLoading)
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