import _ from 'lodash';
import Vue from 'vue';
import deipRpc from '@deip/deip-rpc-client';
import agencyHttp from './../../../services/http/agency';
import { randomBytes } from 'crypto';

const state = {
    agency: undefined,
    program: undefined,
    area: undefined,

    corePrograms: [
        { agency: "nsf", title: "Cyber-Human Systems (CHS)", postedDate: new Date(), closingDate: new Date(), number: "PAR-19-36", award: 50000, disciplines: [8, 140] },
        { agency: "nsf", title: "Atomic, Molecular and Optical Physics - Theory", postedDate: new Date(), closingDate: new Date(), number: "PAR-20-36", award: 100000, disciplines: [4] },
        { agency: "nsf", title: "Improvements to Biological Field Stations and Marine Laboratories (FSML)", postedDate: new Date(), closingDate: new Date(), number: "PAR-21-36", award: 100000, disciplines: [3] }
      ],

    additionalPrograms: [
        { agency: "nsf", title: "Collaborative Research in Computational Neuroscience (CRCNS)", postedDate: new Date(), closingDate: new Date(), number: "PAR-23-36", award: 130000, disciplines: [3] },
        { agency: "nsf", title: "Computer Science for All (CSforAll:RPP)", postedDate: new Date(), closingDate: new Date(), number: "PAR-25-36", award: 940000, disciplines: [8] },
        { agency: "nsf", title: "Critical Techniques, Technologies and Methodologies for Advancing Foundations and Applications of Big Data Sciences and Engineering (BIGDATA)", postedDate: new Date(), closingDate: new Date(), number: "PAR-25-36", award: 900000, disciplines: [135]},
        { agency: "nsf", title: "Cyber-Physical Systems (CPS)", postedDate: new Date(), closingDate: new Date(), number: "PAR-26-36", award: 540000, disciplines: [151] },
        { agency: "nsf", title: "Cyberlearning for Work at the Human-Technology Frontier", postedDate: new Date(), closingDate: new Date(), number: "PAR-27-36", award: 80000, disciplines: [140] },
        { agency: "nsf", title: "Designing Materials to Revolutionize and Engineer our Future (DMREF)", postedDate: new Date(), closingDate: new Date(), number: "PAR-28-36", award: 30000, disciplines: [80, 81] },
        { agency: "nsf", title: "Expeditions in Computing", postedDate: new Date(), closingDate: new Date(), number: "PAR-30-36", award: 80000, disciplines: [10] }
    ],

    isLoadingAgencyProgramsListingPage: undefined,
    isLoadingAgencyProgramDetailsPage: undefined,

    isLoadingAgencyProfile: undefined,
    isLoadingAgencyProgram: undefined
}

// getters
const getters = {
    agency: (state, getters) => state.agency,
    area: (state, getters) => state.area,
    program: (state, getters) => state.program,
    corePrograms: (state, getters) => state.corePrograms,
    additionalPrograms: (state, getters) => state.additionalPrograms,

    isLoadingAgencyProgramsListingPage: (state, getters) => state.isLoadingAgencyProgramsListingPage !== false,
    isLoadingAgencyProgramDetailsPage: (state, getters) => state.isLoadingAgencyProgramDetailsPage !== false
}

// actions
const actions = {

    // pages
    loadAgencyProgramsListingPage({ state, dispatch, commit }, { agency }) {
        const promises = [];
        const agencyProfileLoad = new Promise((resolve, reject) => {
            dispatch('loadAgencyProfile', { agency, notify: resolve })
        });
        promises.push(agencyProfileLoad);

        commit('SET_AGENCY_PROGRAMS_LISTING_PAGE_LOADING_STATE', true);
        return Promise.all(promises)
            .then(() => {
                // preselect research area
                if (state.program) {
                    // this is very buggy, must be refactored once we have mapping between programs and research areas 
                    let area = state.agency.researchAreas.find(a => {
                        return a.subAreas.some(sa => sa.disciplines.some(d => state.program.disciplines.includes(d)));
                    });
                    let subArea = a.subAreas.find(sa => sa.disciplines.some(d => state.program.disciplines.includes(d)));
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

    loadAgencyProgramDetailsPage({ state, dispatch, commit }, { agency, foaId }) {
        let loadFromCache = state.agency && state.agency._id === agency;
        const promises = [];

        if (!loadFromCache) {
            const agencyProfileLoad = new Promise((resolve, reject) => {
                dispatch('loadAgencyProfile', { agency, notify: resolve })
            });
            promises.push(agencyProfileLoad);
        }
        
        const programLoad = new Promise((resolve, reject) => {
            dispatch('loadAgencyProgram', { foaId, notify: resolve })
        });
        promises.push(programLoad);

        commit('SET_AGENCY_PROGRAM_DETAILS_PAGE_LOADING_STATE', true);
        return Promise.all(promises)
            .catch(err => { console.log(err) })
            .finally(() => {
                commit('SET_AGENCY_PROGRAM_DETAILS_PAGE_LOADING_STATE', false);
            });
    },

    // components
    loadAgencyProfile({ state, dispatch, commit }, { agency, notify }) {
        commit('SET_AGENCY_PROFILE_LOADING_STATE', true);
        agencyHttp.getAgencyProfile(agency)
            .then((agencyProfile) => {
                commit('SET_AGENCY_PROFILE', agencyProfile);
            })
            .catch(err => { console.log(err) })
            .finally(() => {
                commit('SET_AGENCY_PROFILE_LOADING_STATE', false);
                if (notify) notify();
            });
    },

    loadAgencyProgram({ state, dispatch, commit }, { foaId, notify }) {
        commit('SET_AGENCY_PROGRAM_LOADING_STATE', true);
        const programs = [...state.corePrograms, ...state.additionalPrograms]; // todo: replace with server call;
        
        Promise.resolve(programs.find(p => p.number == foaId))
            .then((program) => {
                commit('SET_AGENCY_PROGRAM', program);
            })
            .catch(err => { console.log(err) })
            .finally(() => {
                commit('SET_AGENCY_PROGRAM_LOADING_STATE', false);
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

    ['SET_AGENCY_PROGRAM'](state, foa) {
        Vue.set(state, 'program', foa)
    },

    ['SET_RESEARCH_AREA'](state, { area, subArea }) {
        Vue.set(state, 'area', {
            title: area.title,
            abbreviation: area.abbreviation,
            subAreaTitle: subArea.title,
            subAreaAbbreviation: subArea.abbreviation,
            disciplines: subArea.disciplines
        });
    },
    
    ['SET_AGENCY_PROGRAM_LOADING_STATE'](state, isLoading) {
        Vue.set(state, 'isLoadingAgencyProgram', isLoading)
    },

    ['SET_AGENCY_PROFILE_LOADING_STATE'](state, isLoading) {
        Vue.set(state, 'isLoadingAgencyProfile', isLoading)
    },

    ['SET_AGENCY_PROGRAMS_LISTING_PAGE_LOADING_STATE'](state, isLoading) {
        Vue.set(state, 'isLoadingAgencyProgramsListingPage', isLoading)
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