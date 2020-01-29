import _ from 'lodash';
import deipRpc from '@deip/deip-oa-rpc-client'
import Vue from 'vue'
import { getAccessToken } from './../../../utils/auth'
import { getEnrichedProfiles } from './../../../utils/user'
import tokenSaleService from './../../../services/TokenSaleService'
import contentHttpService from './../../../services/http/content'
import applicationsHttpService from './../../../services/http/application'
import * as researchService from './../../../services/ResearchService';

const state = {
    research: null,
    group: null,
    contentList: [],
    applicationsList: [],
    researchGroupMembersList: [],
    reviewsList: [],
    disciplinesList: [],
    totalVotesList: [],
    tokenSale: undefined,
    tokenSalesList: [],
    tokenHoldersList: [],
    contributionsList: [],
    groupInvitesList: [],
    contentRefsList: [],
    applicationsRefsList: [],
    userContributionsList: [],
    expertsList: [],

    isLoadingResearchDetails: undefined,
    isLoadingResearchContent: undefined,
    isLoadingResearchMembers: undefined,
    isLoadingResearchReviews: undefined,
    isLoadingResearchDisciplines: undefined,
    isLoadingResearchTokenHolders: undefined,
    isLoadingResearchTokenSale: undefined,
    isLoadingResearchContentRefs: undefined,
    isLoadingResearchGroupDetails: undefined,
    isLoadingResearchApplications: undefined,
    isLoadingResearchApplicationsRefs: undefined
}

// getters
const getters = {

    research: (state, getters) => {
        return state.research;
    },

    group: () => {
        return state.group;
    },
    
    contentList: (state, getters) => {
        return state.contentList;
    },

    applicationsList: (state, getters) => {
        return state.applicationsList;
    },

    contentRefsList: (state, getters) => {
        return state.contentRefsList;
    },

    researchReferencesList: (state, getters) => {
        return [].concat.apply([], state.contentRefsList.map(ref => ref.externalReferences || []))
            .map(ref => { return { title: ref, source: ""}});
    },

    researchGroupMembersList: (state, getters) => {
        return state.researchGroupMembersList;
    },

    researchMembersList: (state, getters) => {
        return state.researchGroupMembersList
            .filter(member => state.research.members.some(m => m == member.account.name));
    },

    reviewsList: (state, getters) => {
        return state.reviewsList.map((review, i) => {
            let researchContent = state.contentList.find(content => content.id == review.research_content_id)
            return { ...review, researchContent };
        });
    },

    disciplinesList: (state, getters) => {
        return state.disciplinesList;
    },

    totalVotesList: (state, getters) => {
        return state.totalVotesList;
    },

    tokenSale: (state, getters) => {
        return state.tokenSale;
    },

    tokenSalesList: (state, getters) => {
        return state.tokenSalesList;
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

    expertsList: (state, getters) => {
        return state.expertsList;
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

    isLoadingResearchContentRefs: (state, getters) => {
        return state.isLoadingResearchContentRefs;
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
            const total_weight = tvo.total_weight;

            if (map[research_content_id] === undefined)
                map[research_content_id] = {};

            map[research_content_id][discipline_id] = total_weight;
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
                const total_weight = tvo.total_weight;

                if (map[discipline_id] === undefined)
                    map[discipline_id] = total_weight;
                else
                    map[discipline_id] += total_weight;
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
    },

    userContributionsList: (state, getters) => {
      return state.userContributionsList;
    }
}

// actions
const actions = {

    loadResearchDetails({ state, commit, dispatch }, { group_permlink, research_permlink }) {
        commit('SET_RESEARCH_DETAILS_LOADING_STATE', true);

        return deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)
            .then((research) => {
                research.group_permlink = group_permlink;
                research.isTop = researchService.getTopResearchesIds().some(id => id == research.id);
                commit('SET_RESEARCH_DETAILS', research)

                const contentLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchContent', { researchId: state.research.id, notify: resolve })
                });
                const contentRefsLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchContentRefs', { researchId: state.research.id, notify: resolve })
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
                const tokenSalesLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchTokenSales', { researchId: state.research.id, notify: resolve })
                });
                const invitesLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchGroupInvites', { researchGroupId: state.research.research_group_id, notify: resolve })
                });
                const groupLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchGroupDetails', { group_permlink, notify: resolve })
                });
                const applicationsLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchApplications', { researchId: state.research.id, notify: resolve })
                });
                const applicationsRefsLoad = new Promise((resolve, reject) => {
                    dispatch('loadResearchApplicationsRefs', { researchId: state.research.id, notify: resolve })
                });
                const userContributionsLoad = new Promise((resolve, reject) => {
                  dispatch('loadUserContributions', { researchId: state.research.id, notify: resolve })
                });

                return Promise.all([
                  contentLoad, membersLoad, reviewsLoad, disciplinesLoad, tokenHoldersLoad,
                  tokenSaleLoad, tokenSalesLoad, invitesLoad, contentRefsLoad, groupLoad,
                  applicationsLoad, applicationsRefsLoad, userContributionsLoad,
                ]);

            }, (err => {console.log(err)}))
            .finally(() => {
                commit('SET_RESEARCH_DETAILS_LOADING_STATE', false)
            })
    },

    loadResearchContent({ state, dispatch, commit }, { researchId, notify }) {
        let contents = [];
        commit('SET_RESEARCH_CONTENT_LOADING_STATE', true);

        deipRpc.api.getAllResearchContentAsync(researchId)
            .then(list => {
                contents = list;
                return Promise.all(contents.map(content => deipRpc.api.getReviewsByContentAsync(content.id)));
            })
            .then(reviews => {
                contents.forEach((content, index) => {
                    content.reviews = reviews[index];
                });

                commit('SET_RESEARCH_CONTENT_LIST', contents);
            })
            .catch(err => { console.log(err) })
            .finally(() => {
                commit('SET_RESEARCH_CONTENT_LOADING_STATE', false)
                if (notify) notify();
            })
    },

    loadResearchApplications({ state, dispatch, commit }, { researchId, notify }) {
        var applications = [];
        commit('SET_RESEARCH_APPLICATONS_LOADING_STATE', true);

        deipRpc.api.getGrantApplicationsByResearchIdAsync(researchId)
            .then(list => {
                applications = list;
                return Promise.all(applications.map(a => deipRpc.api.getFundingOpportunityAsync(a.grant_id)));
            })
            .then((foaList) => {
                for (let i = 0; i < applications.length; i++) {
                    const application = applications[i];
                    application.foa = foaList[i];
                    const hashes = application.application_hash.split(':');
                    application.letterHash = hashes[0];
                    application.packageHash = hashes[1];
                }
                commit('SET_RESEARCH_APPLICATIONS_LIST', applications);
            })
            .catch(err => { console.log(err) })
            .finally(() => {
                commit('SET_RESEARCH_APPLICATONS_LOADING_STATE', false)
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
        commit('SET_RESEARCH_REVIEWS_LOADING_STATE', true);

        deipRpc.api.getReviewsByResearchAsync(researchId)
            .then(items => {
                reviews.push(...items);
                return Promise.all([
                    Promise.all(reviews.map(item => deipRpc.api.getReviewVotesByReviewIdAsync(item.id))),
                    getEnrichedProfiles(reviews.map(r => r.author))
                ]);
            }, (err) => {console.log(err)})
            .then(([reviewVotes, users]) => {
                reviews.forEach((review, i) => {
                    review.author = users.find(u => u.account.name == review.author);
                    review.votes = reviewVotes[i];
                });
                commit('SET_RESEARCH_REVIEWS_LIST', reviews);
            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_REVIEWS_LOADING_STATE', false)
                if (notify) notify();
            })
    },

    loadResearchDisciplines({ state, dispatch, commit }, { researchId, notify }) {
        const disciplinesList = [];
        commit('SET_RESEARCH_DISCIPLINES_LOADING_STATE', true)

        deipRpc.api.getDisciplinesByResearchAsync(researchId)
            .then((data) => {
                const tvoPromises = [];
                const statsPromises = [];
                const expertsPromises = [];

                for (var i = 0; i < data.length; i++) {
                    var discipline = data[i];
                    disciplinesList.push(discipline);
                    tvoPromises.push(deipRpc.api.getTotalVotesByResearchAndDisciplineAsync(researchId, discipline.id));

                    statsPromises.push(
                        deipRpc.api.getEciAndExpertiseStatsByDisciplineIdAsync(discipline.id)
                    )
                    expertsPromises.push(
                      deipRpc.api.getExpertTokensByDisciplineIdAsync(discipline.id)
                    );
                }

                return Promise.all([
                    Promise.all(tvoPromises),
                    Promise.all(statsPromises),
                    Promise.all(expertsPromises)
                ]);
            }, (err) => {console.log(err)})
            .then(([tvoList, disciplinesStats, expertTokensPerDiscipline]) => {
                const expertsAccountNames = [];
                expertTokensPerDiscipline.forEach((e) => {
                  expertsAccountNames.push(...e.map(et => et.account_name));
                });
                disciplinesList.forEach((discipline, i) => {
                    discipline.stats = disciplinesStats[i];
                });
                commit('SET_RESEARCH_DISCIPLINES_LIST', disciplinesList)
                commit('SET_RESEARCH_TOTAL_VOTES_LIST', tvoList)
                return getEnrichedProfiles(_.uniq(expertsAccountNames));
            }, (err) => {console.log(err)})
            .then((expertsList) => {
              commit('SET_EXPERTS_LIST', expertsList);
            })
            .finally(() => {
                commit('SET_RESEARCH_DISCIPLINES_LOADING_STATE', false)
                if (notify) notify();
            })
    },

    loadResearchTokenHolders({ state, dispatch, commit }, { researchId, notify }) {
        const tokenHolders = [];
        commit('SET_RESEARCH_TOKEN_HOLDERS_LOADING_STATE', true)
        deipRpc.api.getResearchTokensByResearchIdAsync(researchId)
            .then((rtList) => {
                tokenHolders.push(...rtList);
                return getEnrichedProfiles(tokenHolders.map(m => m.account_name))
            }, (err) => {console.log(err)})
            .then((users) => {
                for (let i = 0; i < tokenHolders.length; i++) {
                    const holder = tokenHolders[i];
                    holder.user = users.find(user => holder.account_name == user.account.name);
                }
                commit('SET_RESEARCH_TOKEN_HOLDERS_LIST', tokenHolders)
            })
            .finally(() => {
                commit('SET_RESEARCH_TOKEN_HOLDERS_LOADING_STATE', false)
                if (notify) notify();
            }) 
    },

    loadResearchTokenSale({ state, dispatch, commit }, { researchId, notify }) {
        commit('SET_RESEARCH_TOKEN_SALE_LOADING_STATE', true);

        return tokenSaleService.getCurrentTokenSaleByResearchId(researchId)
            .then(tokenSale => {
                commit('SET_RESEARCH_TOKEN_SALE', tokenSale);

                if (tokenSale) {
                    return dispatch('loadTokenSaleContributors');
                }
            }, (err) => {console.log(err)})
        .finally(() => {
            commit('SET_RESEARCH_TOKEN_SALE_LOADING_STATE', false)
            if (notify) notify();
        })
    },

    loadResearchTokenSales({ state, dispatch, commit }, { researchId, notify }) {
        return deipRpc.api.getResearchTokenSalesByResearchIdAsync(researchId)
            .then(tokenSales => {
                commit('SET_RESEARCH_TOKEN_SALES', tokenSales);
            }, (err) => {console.log(err)})
        .finally(() => {
            if (notify) notify();
        })
    },

    loadResearchContentRefs({ state, dispatch, commit }, { researchId, notify }) {
        commit('SET_RESEARCH_CONTENT_REFS_LOADING_STATE', true)
        contentHttpService.getContentRefs({researchId})
            .then((refs) => {
                commit('SET_RESEARCH_CONTENT_REFS', refs)
            }, (err) => { console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_CONTENT_REFS_LOADING_STATE', false)
                if (notify) notify();
            })
    },

    loadResearchApplicationsRefs({ state, dispatch, commit }, { researchId, notify }) {
        commit('SET_RESEARCH_APPLICATIONS_REFS_LOADING_STATE', true)
        applicationsHttpService.getApplicationsRefsByResearch(researchId)
            .then((refs) => {
                commit('SET_RESEARCH_APPLICATIONS_REFS', refs)
            }, (err) => { console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_APPLICATIONS_REFS_LOADING_STATE', false)
                if (notify) notify();
            })
    },

    loadTokenSaleContributors({ state, commit }) {
        const contributors = []
        return deipRpc.api.getResearchTokenSaleContributionsByResearchTokenSaleIdAsync(state.tokenSale.id)
            .then((contributions) => {
              contributors.push(...contributions);
              return getEnrichedProfiles(contributions.map(m => m.owner))
            })
            .then((users) => {
              for (let i = 0; i < contributors.length; i++) {
                const contributor = contributors[i];
                contributor.user = users.find(user => contributor.owner == user.account.name);
              }
              commit('SET_RESEARCH_TOKEN_SALE_CONTRIBUTIONS_LIST', contributors)
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

    loadResearchGroupDetails({ state, commit, dispatch }, { group_permlink, notify }) {
        commit('SET_RESEARCH_GROUP_DETAILS_LOADING_STATE', true)
        deipRpc.api.getResearchGroupByPermlinkAsync(group_permlink)
            .then((group) => {
                commit('SET_RESEARCH_GROUP_DETAILS', group)
            }, (err) => {console.log(err)})
            .finally(() => {
                commit('SET_RESEARCH_GROUP_DETAILS_LOADING_STATE', false)
                if (notify) notify();
            });
    },

    loadUserContributions({ state, commit, rootGetters }, { researchId, notify }) {
      const user = rootGetters['auth/user'];
      return deipRpc.api.getContributionsHistoryByContributorAndResearchAsync(user.account.name, researchId)
        .then((hist) => {
          const contributions = hist.map((h) => {
            return {
              tokenSaleId: h.op[1].research_token_sale_id,
              amount: h.op[1].amount
            };
          });
          commit('SET_USER_CONTRIBUTIONS_LIST', contributions);
        }).finally(() => {
          if (notify) notify();
        });
    },
}

// mutations
const mutations = {

    ['SET_RESEARCH_DETAILS'](state, research) {
        Vue.set(state, 'research', research)
    },

    ['SET_RESEARCH_MEMBERS_LIST'](state, list) {
        Vue.set(state, 'researchGroupMembersList', list)
    },

    ['SET_RESEARCH_CONTENT_LIST'](state, list) {
        Vue.set(state, 'contentList', list)
    },

    ['SET_RESEARCH_APPLICATIONS_LIST'](state, applications) {
        Vue.set(state, 'applicationsList', applications)
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

    ['SET_RESEARCH_TOKEN_SALE'](state, tokenSale) {
        Vue.set(state, 'tokenSale', tokenSale)
    },

    ['SET_RESEARCH_TOKEN_SALES'](state, list) {
        Vue.set(state, 'tokenSalesList', list)
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

    ['SET_RESEARCH_CONTENT_REFS'](state, refs) {
        Vue.set(state, 'contentRefsList', refs)
    },

    ['SET_RESEARCH_APPLICATIONS_REFS'](state, refs) {
        Vue.set(state, 'applicationsRefsList', refs)
    },

    ['SET_USER_CONTRIBUTIONS_LIST'](state, list) {
        Vue.set(state, 'userContributionsList', list)
    },

    ['SET_EXPERTS_LIST'](state, list) {
        Vue.set(state, 'expertsList', list)
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

    ['SET_RESEARCH_APPLICATONS_LOADING_STATE'](state, value) {
        state.isLoadingResearchApplications = value
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

    ['SET_RESEARCH_CONTENT_REFS_LOADING_STATE'](state, value) {
        state.isLoadingResearchContentRefs = value
    },

    ['SET_RESEARCH_APPLICATIONS_REFS_LOADING_STATE'](state, value) {
        state.isLoadingResearchApplicationsRefs = value
    },

    ['SET_RESEARCH_GROUP_DETAILS_LOADING_STATE'](state, value) {
        state.isLoadingResearchGroupDetails = value
    },

    ['SET_RESEARCH_GROUP_DETAILS'](state, value) {
        Vue.set(state, 'group', value)
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