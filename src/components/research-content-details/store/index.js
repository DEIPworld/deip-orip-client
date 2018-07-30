import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client'
import Vue from 'vue'
import { getEnrichedProfiles } from './../../../utils/user'
import darService from './../../../services/dar'

var texture = undefined;

const state = {
    content: null,
    research: null,
    disciplinesList: [],
    totalVotesList: [],
    membersList: [],

    darRef: null,
    textureApiRef: null,

    isLoadingResearchContentPage: undefined,
    isLoadingResearchContentVotes: undefined,
    isLoadingResearchDetails: undefined,
    isLoadingResearchContentDetails: undefined,
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

    darRef: (state, getters) => {
        return state.darRef;
    },

    texture: (state, getters) => {
        return texture;
    },

    membersList: (state, getters) => {
        return state.membersList;
    },

    isLoadingResearchContentPage: (state, getters) => {
        return state.isLoadingResearchContentPage;
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

    loadResearchContentDetails({ state, commit, dispatch },
            { group_permlink, research_permlink, content_permlink, darRef }) {

        commit('RESET_STATE');

        commit('SET_RESEARCH_CONTENT_PAGE_LOADING_STATE', true)

        if (!content_permlink || content_permlink == '!draft') {
            // this is dar draft
            commit('SET_RESEARCH_CONTENT_DAR_REF', darRef)
            deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)
                .then((research) => {
                    // const contentVotesLoad = new Promise((resolve, reject) => {
                    //     dispatch('loadResearchContentVotes', { researchId: research.id, notify: resolve })
                    // });

                    const researchDetailsLoad = new Promise((resolve, reject) => {
                        dispatch('loadResearchDetails', { group_permlink, research_permlink, notify: resolve })
                    });

                    return Promise.all([researchDetailsLoad])
                })
                .finally(() => {
                    commit('SET_RESEARCH_CONTENT_PAGE_LOADING_STATE', false)
                });

        } else {
            commit('SET_RESEARCH_CONTENT_DETAILS_LOADING_STATE', true)
             deipRpc.api.getResearchContentByAbsolutePermlinkAsync(group_permlink, research_permlink, content_permlink)
                .then((content) => {
                    commit('SET_RESEARCH_CONTENT_DETAILS', content)

                    const darRefLoad = content.content.slice(0, 4) === 'dar:' ? new Promise((resolve, reject) => {
                        dispatch('loadResearchContentDarRef', {hashOrId: content.content.slice(4), notify: resolve })
                    }) : Promise.resolve();

                    const researchDetailsLoad = new Promise((resolve, reject) => {
                        dispatch('loadResearchDetails', { group_permlink, research_permlink, notify: resolve })
                    });
                    const contentVotesLoad = new Promise((resolve, reject) => {
                        dispatch('loadResearchContentVotes', { researchId: content.research_id, notify: resolve })
                    });

                    return Promise.all([darRefLoad, researchDetailsLoad, contentVotesLoad])
                }, (err) => {console.log(err)})
                .finally(() => {
                    commit('SET_RESEARCH_CONTENT_DETAILS_LOADING_STATE', false)
                    commit('SET_RESEARCH_CONTENT_PAGE_LOADING_STATE', false)
                });
        }
    },

    loadResearchContentVotes({ state, commit }, { researchId, notify }) {
        commit('SET_RESEARCH_CONTENT_VOTES_LOADING_STATE', true)
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
            }, (err) => {console.log(err)})
            .then((tvoList) => {
                commit('SET_RESEARCH_CONTENT_DISCIPLINES_LIST', disciplinesList)
                commit('SET_RESEARCH_CONTENT_TOTAL_VOTES_LIST', tvoList)
            }).finally(() => {
                commit('SET_RESEARCH_CONTENT_VOTES_LOADING_STATE', false)
                if (notify) notify();
            });
    },

    loadResearchDetails({ state, commit, dispatch }, { group_permlink, research_permlink, notify }) {
        commit('SET_RESEARCH_DETAILS_LOADING_STATE', true)

        const rgtList = [];
        deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)
            .then((research) => {
                commit('SET_RESEARCH_DETAILS', research)
                return deipRpc.api.getResearchGroupTokensByResearchGroupAsync(research.id)
            }).then((members) => {
                rgtList.push(...members)
                return getEnrichedProfiles(members.map(m => m.owner))

            }, (err) => {console.log(err)}) 
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

    loadResearchContentDarRef({ state, commit, dispatch }, { hashOrId, notify }) {
        debugger;
        darService.getDraftMeta(hashOrId)
            .then((res) => {
                debugger;
                commit('SET_RESEARCH_CONTENT_DAR_REF', res._id)
            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_DETAILS_LOADING_STATE', false)
                if (notify) notify();
            });
    },


    setTexture({ state, commit, dispatch }, instance) {
        // temporal hack to avoid blocking while converting texture nested props to reactive ones, 
        // do not do this in regular code without 'commit' call!
        texture = instance.texture;
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
    },

    ['SET_RESEARCH_CONTENT_DAR_REF'](state, darRef) {
        state.darRef = darRef
    },

    ['SET_RESEARCH_CONTENT_PAGE_LOADING_STATE'](state, value) {
        state.isLoadingResearchContentPage = value
    },

    ['SET_RESEARCH_DETAILS_LOADING_STATE'](state, value) {
        state.isLoadingResearchDetails = value
    },

    ['SET_RESEARCH_CONTENT_DETAILS_LOADING_STATE'](state, value) {
        state.isLoadingResearchContentDetails = value
    },

    ['SET_RESEARCH_CONTENT_VOTES_LOADING_STATE'](state, value) {
        state.isLoadingResearchContentVotes = value
    },

    ['SET_RESEARCH_MEMBERS_LIST'](state, list) {
        Vue.set(state, 'membersList', list)
    },

    ['RESET_STATE'](state) {
        Vue.set(state, 'membersList', [])
        Vue.set(state, 'disciplinesList', [])
        Vue.set(state, 'totalVotesList', [])
        Vue.set(state, 'content', null)
        Vue.set(state, 'research', null)
        Vue.set(state, 'darRef', null)
        Vue.set(state, 'textureApiRef', null)
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