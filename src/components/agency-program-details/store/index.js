import Vue from 'vue';
import deipRpc from '@deip/deip-rpc-client';
import agencyHttp from './../../../services/http/agency';
import { mapAreaToProgram } from '../../common/disciplines/DisciplineTreeService'
import { getEnrichedProfiles } from './../../../utils/user';

const state = {
    agency: undefined,
    program: undefined,
    applications: [],

    corePrograms: [],
    additionalPrograms: [],
    
    isLoadingAgencyProgramDetailsPage: undefined,
    isLoadingAgencyProgramDetails: undefined,
    isLoadingAgencyProgramApplications: undefined
}

// getters
const getters = {
    agency: (state, getters) => state.agency,
    program: (state, getters) => state.program,
    applications: (state, getters) => state.applications,
    
    corePrograms: (state, getters) => state.corePrograms,
    additionalPrograms: (state, getters) => state.additionalPrograms,

    isLoadingAgencyProgramDetailsPage: (state, getters) => state.isLoadingAgencyProgramDetailsPage !== false
}

// actions
const actions = {
    loadAgencyProgramDetailsPage({ state, dispatch, commit }, { agency, foaId }) {
        commit('SET_AGENCY_PROGRAM_DETAILS_PAGE_LOADING_STATE', true);
        return agencyHttp.getAgencyProfile(agency)
            .then((agencyProfile) => {
                commit('SET_AGENCY_PROFILE', agencyProfile);
                const agencyProgramDetailsLoad = new Promise((resolve, reject) => {
                    dispatch('loadAgencyProgramDetails', { foaId })
                        .then(() => {
                            dispatch('loadAgencyProgramApplications', { notify: resolve })
                        });
                });
                return Promise.all([agencyProgramDetailsLoad])
            })
            .catch(err => { console.log(err) })
            .finally(() => {
                commit('SET_AGENCY_PROGRAM_DETAILS_PAGE_LOADING_STATE', false);
            });
    },

    loadAgencyProgramDetails({ state, dispatch, commit }, { foaId, notify }) {
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
    },

    loadAgencyProgramApplications({ state, dispatch, commit }, { notify }) {
        commit('SET_AGENCY_PROGRAM_APPLICATIONS_LOADING_STATE', true);

        let applications = [];

        deipRpc.api.getApplicationsByGrantAsync(state.program.id)
            .then(list => {
                applications = list;
    
                const totalVotesPromises = applications.map(application => 
                    deipRpc.api.getTotalVotesByResearchAsync(application.research_id)
                );
    
                const researchesPromises = applications.map(application =>
                    deipRpc.api.getResearchByIdAsync(application.research_id)
                );

                const reviewsPromises = applications.map(application =>
                    deipRpc.api.getReviewsByGrantApplicationAsync(application.id)
                );
    
                return Promise.all([
                    Promise.all(totalVotesPromises),
                    Promise.all(researchesPromises),
                    Promise.all(reviewsPromises)
                ]);
            })
            .then(([totalVotes, researches, reviewsList]) => {
                let totalVotesMap = _.chain(totalVotes)
                    .flatten()
                    .groupBy('research_id')
                    .value();
    
                applications.forEach((application, index) => {
                    application.totalVotes = totalVotesMap[application.research_id] ? totalVotesMap[application.research_id] : [];
                    application.research = researches[index];
                    application.reviews = reviewsList[index].filter(r => r.is_grant_application);
                });

                const groupPromises = researches.map(research =>
                    deipRpc.api.getResearchGroupByPermlinkAsync(research.group_permlink)
                );
    
                return Promise.all([
                    Promise.all(groupPromises)
                ]);
            })
            .then(([groups]) => {
                applications.forEach((application, index) => {
                    application.group = groups[index];
                });
    
                const authorsPromises = groups.map(group =>
                    deipRpc.api.getResearchGroupTokensByResearchGroupAsync(group.id)
                        .then(researchGroupTokens => 
                            getEnrichedProfiles(researchGroupTokens.map(t => t.owner))
                        )
                );

                return Promise.all([
                    Promise.all(authorsPromises)
                ]);
            })
            .then(([authors]) => {
                applications.forEach((application, index) => {
                    application.enrichedAuthors = authors[index];
                });

                return applications;
            })
            .then(applications => {
                commit('SET_AGENCY_PROGRAM_APPLICATIONS', applications);
            })
            .catch(err => { console.log(err) })
            .finally(() => {
                commit('SET_AGENCY_PROGRAM_APPLICATIONS_LOADING_STATE', false);
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

    ['SET_AGENCY_PROGRAM_APPLICATIONS'](state, applications) {
        Vue.set(state, 'applications', applications)
    },

    ['SET_AGENCY_PROGRAM_LOADING_STATE'](state, isLoading) {
        Vue.set(state, 'isLoadingAgencyProgramDetails', isLoading)
    },

    ['SET_AGENCY_PROGRAM_APPLICATIONS_LOADING_STATE'](state, isLoading) {
        Vue.set(state, 'isLoadingAgencyProgramApplications', isLoading)
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