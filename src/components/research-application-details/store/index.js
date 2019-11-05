import deipRpc from '@deip/deip-oa-rpc-client'
import Vue from 'vue'
import { getEnrichedProfiles } from './../../../utils/user'
import applicationHttpService from './../../../services/http/application'

var applicationReviewEditor = undefined;

const state = {
    application: null,
    research: null,
    group: null,
    applicationRef: null,
    program: null,
    membersList: [],
    applicationReviewsList: [],
    thirdpartyApplicationsReviewsList: [],

    isLoadingResearchDetails: undefined,
    isLoadingResearchApplicationDetails: undefined,
    isLoadingResearchApplicationReviews: undefined,
    isLoadingThirdpartyResearchApplicationsReviews: undefined
}

// getters
const getters = {
    application: (state, getters) => state.application,
    research: (state, getters) => state.research,
    group: (state, getters) => state.group,
    applicationRef: (state, getters) => state.applicationRef,
    program: (state, getters) => state.program,
    membersList: (state, getters) => state.membersList,
    applicationReviewsList: (state, getters) => state.applicationReviewsList,
    thirdpartyApplicationsReviewsList: (state, getters) => state.thirdpartyApplicationsReviewsList,
    allApplicationsReviewsList: (state, getters) => state.applicationReviewsList.concat(state.thirdpartyApplicationsReviewsList),
    applicationReviewEditor: (state, getters) => applicationReviewEditor,
    isLoadingResearchApplicationDetails: (state, getters) => state.isLoadingResearchApplicationDetails
}

// actions
const actions = {

    loadResearchApplicationDetails({ state, commit, dispatch }, { group_permlink, research_permlink, application_id }) {

        commit('RESET_STATE');
        commit('SET_RESEARCH_APPLICATIONS_DETAILS_LOADING_STATE', true);

        return deipRpc.api.getGrantApplicationAsync(application_id)
            .then((application) => {
                const hashes = application.application_hash.split(':');
                application.letterHash = hashes[0];
                application.packageHash = hashes[1];

                commit('SET_RESEARCH_APPLICATION_DETAILS', application)

                const programLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchApplicationProgram', { grant_id: application.grant_id, notify: resolve })
                });
                const researchDetailsLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchDetails', { group_permlink, research_permlink, notify: resolve })
                });
                const applicationReviewsLoad = new Promise((resolve, reject) => {
                    dispatch('loadApplicationReviews', { application_id, notify: resolve })
                });
                const thirdpatyReviewsLoad = new Promise((resolve, reject) => {
                    dispatch('loadThirdpatyReviews', { currentApplication: application, group_permlink, research_permlink, notify: resolve })
                });

                return Promise.all([programLoad, researchDetailsLoad, applicationReviewsLoad, thirdpatyReviewsLoad])
            }, (err) => {console.log(err)})
            .then(() => {
                const applicationRefLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchApplicationRef', 
                    { agency: state.program.agency_name, foaId: state.program.id, hash: state.application.packageHash, notify: resolve })
                });
                return Promise.all([applicationRefLoad])
            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_APPLICATIONS_DETAILS_LOADING_STATE', false);
            });
    },

    loadResearchApplicationRef({ state, commit, dispatch }, { agency, foaId, hash, notify }) {
        return applicationHttpService.getApplicationPackageRef(agency, foaId, hash)
            .then((applicationRef) => {
                commit('SET_RESEARCH_APPLICATION_REF', applicationRef);
            }, (err) => {console.log(err)})
            .finally(() => {
                if (notify) notify();
            });
    },

    loadResearchApplicationProgram({ state, commit, dispatch }, { grant_id, notify }) {
        return deipRpc.api.getFundingOpportunityAsync(grant_id)
            .then((foa) => {
                commit('SET_RESEARCH_APPLICATION_PROGRAM', foa);
            }, (err) => {console.log(err)})
            .finally(() => {
                if (notify) notify();
            });
    },

    loadApplicationReviews({ state, dispatch, commit }, { application_id, notify }) {
        const reviews = [];
        commit('SET_RESEARCH_APPLICATION_REVIEWS_LOADING_STATE', true);

        deipRpc.api.getGrantApplicationReviewsByGrantApplicationAsync(application_id)
            .then(items => {
                reviews.push(...items);
                return Promise.all([
                    Promise.all(reviews.map(review => deipRpc.api.getReviewVotesByReviewIdAsync(review.id))),
                    getEnrichedProfiles(reviews.map(r => r.author)),
                    Promise.all(reviews.map(review => 
                        deipRpc.api.getGrantApplicationAsync(review.grant_application_id)
                            .then((application) => deipRpc.api.getFundingOpportunityAsync(application.grant_id))))
                ]);
            }, (err) => { console.log(err) })
            .then(([reviewVotes, users, programs]) => {
                reviews.forEach((review, i) => {
                    review.author = users.find(u => u.account.name == review.author);
                    review.votes = reviewVotes[i];
                    review.program = programs[i];
                });

                commit('SET_RESEARCH_APPLICATION_REVIEWS_LIST', reviews);
            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_APPLICATION_REVIEWS_LOADING_STATE', false)
                if (notify) notify();
            })
    },

    loadThirdpatyReviews({ state, dispatch, commit }, { currentApplication, group_permlink, research_permlink, notify }) {
        commit('SET_THIRDPARTY_RESEARCH_APPLICATIONS_REVIEWS_LOADING_STATE', true);

        const reviews = [];
        deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)
            .then((research) => {
                return deipRpc.api.getApplicationsByResearchIdAsync(research.id)
            })
            .then((applications) => {
                const related = applications.filter((a) => {
                    const hashes = a.application_hash.split(':');
                    a.letterHash = hashes[0];
                    a.packageHash = hashes[1];
                    return a.letterHash == currentApplication.letterHash && a.id != currentApplication.id
                });
                return Promise.all(related.map(a => deipRpc.api.getGrantApplicationReviewsByGrantApplicationAsync(a.id)))
            }, (err) => { console.log(err) })
            .then(items => {
                const flatten = [].concat.apply([], items);
                reviews.push(...flatten);
                return Promise.all([
                    Promise.all(reviews.map(item => deipRpc.api.getReviewVotesByReviewIdAsync(item.id))),
                    getEnrichedProfiles(reviews.map(r => r.author)),
                    Promise.all(reviews.map(review => 
                        deipRpc.api.getGrantApplicationAsync(review.grant_application_id)
                            .then((application) => deipRpc.api.getFundingOpportunityAsync(application.grant_id)))),
                ]);
            }, (err) => { console.log(err) })
            .then(([reviewVotes, users, programs]) => {
                reviews.forEach((review, i) => {
                    review.author = users.find(u => u.account.name == review.author);
                    review.votes = reviewVotes[i];
                    review.program = programs[i];
                });
                commit('SET_THIRDPARTY_RESEARCH_APPLICATIONS_REVIEWS_LIST', reviews);

            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_THIRDPARTY_RESEARCH_APPLICATIONS_REVIEWS_LOADING_STATE', false);
                if (notify) notify();
            })
    },

    loadResearchDetails({ state, commit, dispatch }, { group_permlink, research_permlink, notify }) {
        commit('SET_RESEARCH_DETAILS_LOADING_STATE', true)

        const rgtList = [];
        deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)
            .then((research) => {
                commit('SET_RESEARCH_DETAILS', research)
                return deipRpc.api.getResearchGroupTokensByResearchGroupAsync(research.research_group_id)
            }).then((members) => {
                rgtList.push(...members)
                return getEnrichedProfiles(members.map(m => m.owner))
            }, (err) => { console.log(err) }) 
            .then((users) => {
                for (let i = 0; i < users.length; i++) {
                    const user = users[i];
                    user.rgt = rgtList.find(rgt => rgt.owner == user.account.name);
                }
                commit('SET_RESEARCH_MEMBERS_LIST', users)
            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_DETAILS_LOADING_STATE', false)
                if (notify) notify();
            });
    },

    setApplicationReviewEditor({ state, commit, dispatch }, instance) {
        // temporal hack to avoid blocking while converting substance nested props to reactive ones, 
        // do not do this in regular code without 'commit' call!
        applicationReviewEditor = instance.applicationReviewEditor;
    },
    
    setApplicationStatus({ state, commit, dispatch }, status) {
        commit('SET_APPLICATION_STATUS', status)
    }
}



// mutations
const mutations = {

    ['SET_RESEARCH_APPLICATION_DETAILS'](state, application) {
        Vue.set(state, 'application', application)
    },

    ['SET_APPLICATION_STATUS'](state, {status}) {
        Vue.set(state.application, 'status', status)
    },

    ['SET_RESEARCH_APPLICATION_REF'](state, ref) {
        Vue.set(state, 'applicationRef', ref)
    },

    ['SET_RESEARCH_APPLICATION_PROGRAM'](state, program) {
        Vue.set(state, 'program', program)
    },

    ['SET_RESEARCH_DETAILS'](state, research) {
        Vue.set(state, 'research', research)
    },

    ['SET_RESEARCH_MEMBERS_LIST'](state, users) {
        Vue.set(state, 'membersList', users)
    },
    
    ['SET_RESEARCH_APPLICATION_REVIEWS_LIST'](state, reviews) {
        reviews.sort((a, b) => a.id - b.id);
        Vue.set(state, 'applicationReviewsList', reviews)
    },

    ['SET_THIRDPARTY_RESEARCH_APPLICATIONS_REVIEWS_LIST'](state, reviews) {
        reviews.sort((a, b) => a.id - b.id);
        Vue.set(state, 'thirdpartyApplicationsReviewsList', reviews)
    },
    
    ['SET_RESEARCH_APPLICATIONS_DETAILS_LOADING_STATE'](state, value) {
        state.isLoadingResearchApplicationDetails = value
    },

    ['SET_THIRDPARTY_RESEARCH_APPLICATIONS_REVIEWS_LOADING_STATE'](state, value) {
        state.isLoadingThirdpartyResearchApplicationsReviews = value
    },

    ['SET_RESEARCH_DETAILS_LOADING_STATE'](state, value) {
        state.isLoadingResearchDetails = value
    },

    ['SET_RESEARCH_APPLICATION_REVIEWS_LOADING_STATE'](state, value) {
        state.isLoadingResearchApplicationReviews = value
    },
    
    ['RESET_STATE'](state) {
        applicationReviewEditor = undefined;
    },
}

const namespaced = true;

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations
}