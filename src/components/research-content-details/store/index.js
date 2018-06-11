import _ from 'lodash';
import deipRpc from '@deip/deip-rpc';
import Vue from 'vue'

const state = {
    content: null,
    research: null,
    disciplinesList: [],
    totalVotesList: []
}

// getters
const getters = {

    content: (state, getters) => {
        return state.content;
    },

    research: (state, getters) => {
        return state.research;
    },

    disciplinesList: (state, getters) => {
        return state.disciplinesList;
    },

    totalVotesList: (state, getters) => {
        return state.totalVotesList;
    },

    contentWeightByDiscipline: function() {
        const map = {};
        const flattened = state.totalVotesList.reduce(
            function(accumulator, currentValue) {
                return accumulator.concat(currentValue);
            }, []);

        for (var i = 0; i < flattened.length; i++) {
            const tvo = flattened[i];
            const discipline_id = tvo.discipline_id.toString();
            const research_content_id = tvo.research_content_id.toString();
            const total_research_reward_weight = tvo.total_research_reward_weight;

            if (map[research_content_id] === undefined)
                map[research_content_id] = {};

            map[research_content_id][discipline_id] = total_research_reward_weight;
        }

        return map;
    }
}

// actions
const actions = {

    loadResearchContentDetails({ state, commit, dispatch }, { group_permlink, research_permlink, content_permlink }) {
        deipRpc.api.getResearchContentByAbsolutePermlinkAsync(group_permlink, research_permlink, content_permlink)
            .then((content) => {
                commit('SET_RESEARCH_CONTENT_DETAILS', content)
                dispatch('loadResearchContentVotes', content.research_id)
            })
    },

    loadResearchContentVotes({ state, commit }, researchId) {
        const disciplinesList = []
        deipRpc.api.getDisciplinesByResearchAsync(researchId)
            .then((data) => {
                const promises = [];
                for (var i = 0; i < data.length; i++) {
                    var discipline = data[i];
                    disciplinesList.push(discipline);
                    promises.push(deipRpc.api.getTotalVotesByResearchAndDisciplineAsync(researchId, discipline.id))
                }
                return Promise.all(promises);
            })
            .then((tvoList) => {
                commit('SET_RESEARCH_CONTENT_DISCIPLINES_LIST', disciplinesList)
                commit('SET_RESEARCH_CONTENT_TOTAL_VOTES_LIST', tvoList)
            });
    },

    loadResearchDetails({ state, commit, dispatch }, { group_permlink, research_permlink }) {
        deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)
            .then((research) => {
                commit('SET_RESEARCH_DETAILS', research)
            })
    }
}

// mutations
const mutations = {

    ['SET_RESEARCH_CONTENT_DETAILS'](state, content) {
        Vue.set(state, 'content', content)
    },

    ['SET_RESEARCH_CONTENT_DISCIPLINES_LIST'](state, list) {
        Vue.set(state, 'disciplinesList', list)
    },

    ['SET_RESEARCH_CONTENT_TOTAL_VOTES_LIST'](state, list) {
        Vue.set(state, 'totalVotesList', list)
    },

    ['SET_RESEARCH_DETAILS'](state, research) {
        Vue.set(state, 'research', research)
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