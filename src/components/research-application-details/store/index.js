import deipRpc from '@deip/deip-rpc-client'
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

    isLoadingResearchDetails: undefined,
    isLoadingResearchApplicationDetails: undefined
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
    applicationReviewEditor: (state, getters) => applicationReviewEditor
}

// actions
const actions = {

    loadResearchApplicationDetails({ state, commit, dispatch }, { group_permlink, research_permlink, application_id }) {

        commit('RESET_STATE');
        commit('SET_RESEARCH_APPLICATIONS_DETAILS_LOADING_STATE', true);

        return deipRpc.api.getGrantApplicationAsync(application_id)
            .then((application) => {
                commit('SET_RESEARCH_APPLICATION_DETAILS', application)

                const contentRefLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchApplicationRef', { hashOrId: application.application_hash, notify: resolve })
                });
                const programLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchApplicationProgram', { grant_id: application.grant_id, notify: resolve })
                });
                const researchDetailsLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchDetails', { group_permlink, research_permlink, notify: resolve })
                });

                return Promise.all([contentRefLoad, programLoad, researchDetailsLoad])
            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_APPLICATIONS_DETAILS_LOADING_STATE', false);
            });
    },

    loadResearchApplicationRef({ state, commit, dispatch }, { hashOrId, notify }) {
        return applicationHttpService.getApplicationRef(hashOrId)
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
    },
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

    ['SET_RESEARCH_MEMBERS_LIST'](state, research) {
        Vue.set(state, 'membersList', research)
    },
    
    ['SET_RESEARCH_APPLICATIONS_DETAILS_LOADING_STATE'](state, value) {
        state.isLoadingResearchApplicationDetails = value
    },

    ['SET_RESEARCH_DETAILS_LOADING_STATE'](state, value) {
        state.isLoadingResearchDetails = value
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