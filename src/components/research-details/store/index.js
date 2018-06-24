import _ from 'lodash';
import deipRpc from '@deip/deip-rpc';
import Vue from 'vue'
import config from './../../../config'
import { getAccessToken } from './../../../utils/auth'
import { getEnrichedProfiles } from './../../../utils/user'

const state = {
    research: null,
    contentList: [],
    membersList: [],
    reviewsList: [],
    disciplinesList: [],
    totalVotesList: [],
    isReviewDialogOpen : false,
    tokenSale: undefined,
    tokenHoldersList: [],
    contributionsList: [],
    groupInvitesList: [],
    isLoadingResearchDetails: undefined,
    isLoadingResearchContent: undefined,
    isLoadingResearchMembers: undefined,
    isLoadingResearchReviews: undefined,
    isLoadingResearchDisciplines: undefined,
    isLoadingResearchTokenHolders: undefined,
    isLoadingResearchTokenSale: undefined

}

// getters
const getters = {

    research: (state, getters) => {
        return state.research;
    },

    contentList: (state, getters) => {
        return state.contentList;
    },

    membersList: (state, getters) => {
        return state.membersList;
    },

    reviewsList: (state, getters) => {
        return state.reviewsList;
    },

    disciplinesList: (state, getters) => {
        return state.disciplinesList;
    },

    totalVotesList: (state, getters) => {
        return state.totalVotesList;
    },

    isReviewDialogOpen: (state, getters) => {
        return state.isReviewDialogOpen;
    },

    tokenSale: (state, getters) => {
        return state.tokenSale;
    },

    tokenHoldersList: (state, getters) => {
        return state.tokenHoldersList;
    },

    contributionsList: (state, getters) => {
        return state.contributionsList;
    },

    groupInvitesList: (state, getters) => {
        return state.groupInvitesList;
    },

    isLoadingResearchContent: (state, getters) => {
        return state.isLoadingResearchContent;
    },

    isLoadingResearchMembers: (state, getters) => {
        return state.isLoadingResearchMembers;
    },

    isLoadingResearchDetails: (state, getters) => {
        return state.isLoadingResearchDetails;
    },

    isLoadingResearchReviews: (state, getters) => {
        return state.isLoadingResearchReviews;
    },

    isLoadingResearchDisciplines: (state, getters) => {
        return state.isLoadingResearchDisciplines;
    },

    isLoadingResearchTokenHolders: (state, getters) => {
        return state.isLoadingResearchTokenHolders;
    },

    isLoadingResearchTokenSale: (state, getters) => {
        return state.isLoadingResearchTokenSale;
    },

    contentWeightByDiscipline: (state, getters) => {
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
    },

    researchWeightByDiscipline: (state, getters) => {
        const map = {};
        for (var i = 0; i < state.totalVotesList.length; i++) {
            const tvoByContent = state.totalVotesList[i];
            for (var j = 0; j < tvoByContent.length; j++) {
                const tvo = tvoByContent[j];
                const discipline_id = tvo.discipline_id.toString();
                const total_research_reward_weight = tvo.total_research_reward_weight;

                if (map[discipline_id] === undefined)
                    map[discipline_id] = total_research_reward_weight;
                else
                    map[discipline_id] += total_research_reward_weight;
            }
        }
        return map;
    },

    timelineOffsets: function() {
        if (state.research !== null && state.contentList !== null &&
            state.contentList.length !== 0) {

            const startTimestamp = Date.parse(state.research.created_at);
            const endTimestamp = Date.parse(state.contentList[state.contentList.length - 1].created_at);
            const allTime = endTimestamp - startTimestamp;

            const offsets = [];
            // the end of timeline can be reached for finished research only
            const maxRatio = state.research.is_finished ? 100 : 70;
            for (let i = 0; i < state.contentList.length; i++) {
                const contentTimestamp = Date.parse(state.contentList[i].created_at);

                // calculate item ratio by its index
                var indexFactor = (i + 1) / state.contentList.length * maxRatio;

                // calculate item ratio by its timestamp
                var timestampFactor;
                if (allTime === 0) {
                    // all research content have been posted at the same time (genesis)
                    timestampFactor = i == state.contentList.length - 1 ? maxRatio : 50;
                } else {
                    var timeAfter = endTimestamp - contentTimestamp;
                    timestampFactor = 100 - (timeAfter / allTime * 100) || 1;
                }

                // adjust position relative to entire timeline period
                var ratio = (indexFactor * timestampFactor) / 100;
                offsets.push({ value: ratio.toFixed(2) });
            }

            return offsets;
        }
        return [];
    }
}

// actions
const actions = {

    loadResearchContent({ state, dispatch, commit }, researchId) {
        commit('SET_RESEARCH_CONTENT_LOADING_STATE', true)
        deipRpc.api.getAllResearchContentAsync(researchId)
            .then((list) => {
                commit('SET_RESEARCH_CONTENT_LIST', list)

            }, (err) => { console.log(err) })
            .finally(() => {
                commit('SET_RESEARCH_CONTENT_LOADING_STATE', false)
            })
    },

    loadResearchDetails({ state, commit, dispatch }, { group_permlink, research_permlink }) {
        commit('SET_RESEARCH_DETAILS_LOADING_STATE', true)
        deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)
            .then((research) => {
                research.group_permlink = group_permlink;
                commit('SET_RESEARCH_DETAILS', research)

                dispatch('loadResearchContent', state.research.id)
                dispatch('loadResearchMembers', state.research.id)
                dispatch('loadResearchReviews', state.research.id)
                dispatch('loadResearchDisciplines', state.research.id)
                dispatch('loadResearchTokenSale', state.research.id)
                dispatch('loadResearchGroupInvites', state.research.research_group_id)

            }, (err => {console.log(err)}))
            .finally(() => {
                commit('SET_RESEARCH_DETAILS_LOADING_STATE', false)
            })
    },

    loadResearchMembers({ state, commit, dispatch }, researchId) {
        const rgtList = [];
        commit('SET_RESEARCH_MEMBERS_LOADING_STATE', true)
        deipRpc.api.getResearchGroupTokensByResearchGroupAsync(researchId)
            .then((members) => {
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
                commit('SET_RESEARCH_MEMBERS_LOADING_STATE', false)
            })
    },

    loadResearchReviews({ state, dispatch, commit }, researchId) {
        const reviews = [];
        commit('SET_RESEARCH_REVIEWS_LOADING_STATE', true)
        deipRpc.api.getReviewsByResearchAsync(researchId)
            .then(items => {
                reviews.push(...items)
                return getEnrichedProfiles(reviews.map(r => r.author))

            }, (err) => {console.log(err)})
            .then((users) => {
                reviews.forEach((review, idx) => {
                    const author = users.find(u => u.account.name == review.author);
                    review.author = author;
                })
                commit('SET_RESEARCH_REVIEWS_LIST', reviews)

            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_REVIEWS_LOADING_STATE', false)
            })
    },

    loadResearchDisciplines({ state, dispatch,commit }, researchId) {
        const disciplinesList = [];
        commit('SET_RESEARCH_DISCIPLINES_LOADING_STATE', true)
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
                commit('SET_RESEARCH_DISCIPLINES_LIST', disciplinesList)
                commit('SET_RESEARCH_TOTAL_VOTES_LIST', tvoList)
            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_DISCIPLINES_LOADING_STATE', false)
            })
    },

    loadResearchTokenHolders({ state, dispatch, commit }, researchId) {
        commit('SET_RESEARCH_TOKEN_HOLDERS_LOADING_STATE', true)
        deipRpc.api.getResearchTokensByResearchIdAsync(researchId)
            .then((tokenHolders) => {
                commit('SET_RESEARCH_TOKEN_HOLDERS_LIST', tokenHolders)
            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_TOKEN_HOLDERS_LOADING_STATE', false)
            }) 
    },

    loadResearchTokenSale({ state, dispatch, commit }, researchId) {
        commit('SET_RESEARCH_TOKEN_SALE_LOADING_STATE', true)
        deipRpc.api.checkResearchTokenSaleExistenceByResearchIdAsync(researchId)
            .then((exists) => {
                if (exists) {
                  return deipRpc.api.getResearchTokenSaleByResearchIdAsync(researchId)
                    .then((tokenSale) => {
                        commit('SET_RESEARCH_TOKEN_SALE', tokenSale)
                        if (tokenSale.status == 2) { // finished token sale
                            dispatch('loadResearchTokenHolders', researchId)
                        } else {
                            commit('SET_RESEARCH_TOKEN_HOLDERS_LIST', [])
                            dispatch('loadTokenSaleContributors');
                        }
                    });
                } else {
                    commit('SET_RESEARCH_TOKEN_SALE', null)
                    commit('SET_RESEARCH_TOKEN_HOLDERS_LIST', [])
                }
            }, (err) => {console.log(err)})
        .finally(() => {
            commit('SET_RESEARCH_TOKEN_SALE_LOADING_STATE', false)
        })
    },

    loadTokenSaleContributors({ state, commit }) {
        deipRpc.api.getResearchTokenSaleContributionsByResearchTokenSaleIdAsync(state.tokenSale.id)
            .then((contributions) => {
                commit('SET_RESEARCH_TOKEN_SALE_CONTRIBUTIONS_LIST', contributions)
            })
    },


    loadResearchGroupInvites({ commit }, groupId) {
        deipRpc.api.getResearchGroupInvitesByResearchGroupIdAsync(groupId)
            .then((invites) => {
                commit('SET_RESEARCH_GROUP_INVITES', invites);
            }, (err) => {
                console.log(err)
            })
    },
    
    openReviewDialog({ state, commit }) {
        commit('TOGGLE_REVIEW_DIALOG', true)
    },

    closeReviewDialog({ state, commit }) {
        commit('TOGGLE_REVIEW_DIALOG', false)
    }
}

// mutations
const mutations = {

    ['SET_RESEARCH_DETAILS'](state, research) {
        Vue.set(state, 'research', research)
    },

    ['SET_RESEARCH_MEMBERS_LIST'](state, list) {
        Vue.set(state, 'membersList', list)
    },

    ['SET_RESEARCH_CONTENT_LIST'](state, list) {
        Vue.set(state, 'contentList', list)
    },

    ['SET_RESEARCH_REVIEWS_LIST'](state, list) {
        Vue.set(state, 'reviewsList', list)
    },

    ['SET_RESEARCH_DISCIPLINES_LIST'](state, list) {
        Vue.set(state, 'disciplinesList', list)
    },

    ['SET_RESEARCH_TOTAL_VOTES_LIST'](state, list) {
        Vue.set(state, 'totalVotesList', list)
    },

    ['TOGGLE_REVIEW_DIALOG'](state, isOpen) {
        state.isReviewDialogOpen = isOpen;
    },

    ['SET_RESEARCH_TOKEN_SALE'](state, tokenSale) {
        Vue.set(state, 'tokenSale', tokenSale)
    },

    ['SET_RESEARCH_TOKEN_HOLDERS_LIST'](state, tokenHolders) {
        Vue.set(state, 'tokenHoldersList', tokenHolders)
    },

    ['SET_RESEARCH_TOKEN_SALE_CONTRIBUTIONS_LIST'](state, contributions) {
        Vue.set(state, 'contributionsList', contributions)
    },

    ['SET_RESEARCH_GROUP_INVITES'](state, invites) {
        Vue.set(state, 'groupInvitesList', invites)
    },

    ['SET_RESEARCH_DETAILS_LOADING_STATE'](state, value) {
        state.isLoadingResearchDetails = value
    },

    ['SET_RESEARCH_MEMBERS_LOADING_STATE'](state, value) {
        state.isLoadingResearchMembers = value
    },

    ['SET_RESEARCH_CONTENT_LOADING_STATE'](state, value) {
        state.isLoadingResearchContent = value
    },

    ['SET_RESEARCH_MEMBERS_LOADING_STATE'](state, value) {
        state.isLoadingResearchMembers = value
    },

    ['SET_RESEARCH_REVIEWS_LOADING_STATE'](state, value) {
        state.isLoadingResearchReviews = value
    },

    ['SET_RESEARCH_DISCIPLINES_LOADING_STATE'](state, value) {
        state.isLoadingResearchDisciplines = value
    },

    ['SET_RESEARCH_TOKEN_HOLDERS_LOADING_STATE'](state, value) {
        state.isLoadingResearchTokenHolders = value
    },
    
    ['SET_RESEARCH_TOKEN_SALE_LOADING_STATE'](state, value) {
        state.isLoadingResearchTokenSale = value
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