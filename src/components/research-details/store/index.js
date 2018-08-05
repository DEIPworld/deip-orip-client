import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client'
import Vue from 'vue'
import config from './../../../config'
import { getAccessToken } from './../../../utils/auth'
import { getEnrichedProfiles } from './../../../utils/user'
import darService from './../../../services/dar'

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
    draftsList: [],

    isLoadingResearchPage: undefined,

    isLoadingResearchDetails: undefined,
    isLoadingResearchContent: undefined,
    isLoadingResearchMembers: undefined,
    isLoadingResearchReviews: undefined,
    isLoadingResearchDisciplines: undefined,
    isLoadingResearchTokenHolders: undefined,
    isLoadingResearchTokenSale: undefined,
    isLoadingResearchDrafts: undefined
}

// getters
const getters = {

    research: (state, getters) => {
        return state.research;
    },

    contentList: (state, getters) => {
        return state.contentList;
    },
    draftsList: (state, getters) => {
        return state.draftsList;
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

    isLoadingResearchPage: state => state.isLoadingResearchPage,

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

    isLoadingResearchDrafts: (state, getters) => {
        return state.isLoadingResearchDrafts;
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

    loadResearchDetails({ state, commit, dispatch }, { group_permlink, research_permlink }) {
        commit('SET_RESEARCH_PAGE_LOADING_STATE', true)

        commit('SET_RESEARCH_DETAILS_LOADING_STATE', true)
        deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)
            .then((research) => {
                research.group_permlink = group_permlink;
                commit('SET_RESEARCH_DETAILS', research)

                const contentLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchContent', { researchId: state.research.id, notify: resolve })
                });
                const draftsLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchDrafts', { researchId: state.research.id, notify: resolve })
                });
                const membersLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchMembers', { groupId: state.research.research_group_id, notify: resolve })
                });
                const reviewsLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchReviews', { researchId: state.research.id, notify: resolve })
                });
                const disciplinesLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchDisciplines', { researchId: state.research.id, notify: resolve })
                });
                const tokenHoldersLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchTokenHolders', { researchId: state.research.id, notify: resolve })
                });
                const tokenSaleLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchTokenSale', { researchId: state.research.id, notify: resolve })
                });
                const invitesLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchGroupInvites', { researchGroupId: state.research.research_group_id, notify: resolve })
                });

                return Promise.all([contentLoad, membersLoad, reviewsLoad, disciplinesLoad, 
                    tokenHoldersLoad, tokenSaleLoad, invitesLoad, draftsLoad])

            }, (err => {console.log(err)}))
            .finally(() => {
                commit('SET_RESEARCH_DETAILS_LOADING_STATE', false)
                commit('SET_RESEARCH_PAGE_LOADING_STATE', false)
            })
    },

    loadResearchContent({ state, dispatch, commit }, { researchId, notify }) {
        commit('SET_RESEARCH_CONTENT_LOADING_STATE', true)
        deipRpc.api.getAllResearchContentAsync(researchId)
            .then((list) => {
                commit('SET_RESEARCH_CONTENT_LIST', list)

            }, (err) => { console.log(err) })
            .finally(() => {
                commit('SET_RESEARCH_CONTENT_LOADING_STATE', false)
                if (notify) notify();
            })
    },

    loadResearchMembers({ state, commit, dispatch }, { groupId, notify }) {
        const rgtList = [];
        commit('SET_RESEARCH_MEMBERS_LOADING_STATE', true)
        deipRpc.api.getResearchGroupTokensByResearchGroupAsync(groupId)
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
                if (notify) notify();
            })
    },

    loadResearchReviews({ state, dispatch, commit }, { researchId, notify }) {
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
                if (notify) notify();
            })
    },

    loadResearchDisciplines({ state, dispatch,commit }, { researchId, notify }) {
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
                if (notify) notify();
            })
    },

    loadResearchTokenHolders({ state, dispatch, commit }, { researchId, notify }) {
        commit('SET_RESEARCH_TOKEN_HOLDERS_LOADING_STATE', true)
        deipRpc.api.getResearchTokensByResearchIdAsync(researchId)
            .then((tokenHolders) => {
                commit('SET_RESEARCH_TOKEN_HOLDERS_LIST', tokenHolders)
            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_TOKEN_HOLDERS_LOADING_STATE', false)
                if (notify) notify();
            }) 
    },

    loadResearchTokenSale({ state, dispatch, commit }, { researchId, notify }) {
        commit('SET_RESEARCH_TOKEN_SALE_LOADING_STATE', true)
        deipRpc.api.checkResearchTokenSaleExistenceByResearchIdAsync(researchId)
            .then((exists) => {
                if (exists) {
                  return deipRpc.api.getResearchTokenSaleByResearchIdAsync(researchId)
                    .then((tokenSale) => {
                        commit('SET_RESEARCH_TOKEN_SALE', tokenSale)
                        dispatch('loadTokenSaleContributors');
                    });
                } else {
                    commit('SET_RESEARCH_TOKEN_SALE', null)
                }
            }, (err) => {console.log(err)})
        .finally(() => {
            commit('SET_RESEARCH_TOKEN_SALE_LOADING_STATE', false)
            if (notify) notify();
        })
    },

    loadResearchDrafts({ state, dispatch, commit }, { researchId, notify }) {
        commit('SET_RESEARCH_DRAFTS_LOADING_STATE', true)
        darService.getDrafts(researchId)
            .then((drafts) => {
                commit('SET_RESEARCH_DRAFTS', drafts)
            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_DRAFTS_LOADING_STATE', false)
                if (notify) notify();
            })
    },

    loadTokenSaleContributors({ state, commit }) {
        deipRpc.api.getResearchTokenSaleContributionsByResearchTokenSaleIdAsync(state.tokenSale.id)
            .then((contributions) => {
                commit('SET_RESEARCH_TOKEN_SALE_CONTRIBUTIONS_LIST', contributions)
            })
    },


    loadResearchGroupInvites({ commit }, { researchGroupId, notify }) {
        deipRpc.api.getResearchGroupInvitesByResearchGroupIdAsync(researchGroupId)
            .then((invites) => {
                commit('SET_RESEARCH_GROUP_INVITES', invites);
            }, (err) => {
                console.log(err)
            }).finally(() => {
                if (notify) notify();
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

    ['SET_RESEARCH_DRAFTS'](state, drafts) {
        Vue.set(state, 'draftsList', drafts)
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
    },

    ['SET_RESEARCH_DRAFTS_LOADING_STATE'](state, value) {
        state.isLoadingResearchDrafts = value
    },

    ['SET_RESEARCH_PAGE_LOADING_STATE'](state, value) {
        state.isLoadingResearchPage = value
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