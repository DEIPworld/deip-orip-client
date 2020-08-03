import _ from 'lodash';
import deipRpc from '@deip/rpc-client';
import Vue from 'vue';

import { AccessService } from '@deip/access-service';
import { ResearchService } from '@deip/research-service';
import { UsersService } from '@deip/users-service';
import { InvestmentsService } from '@deip/investments-service';
import { ResearchContentService } from '@deip/research-content-service';
import { GrantsService } from '@deip/grants-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';

const accessService = AccessService.getInstance();
const researchService = ResearchService.getInstance();
const usersService = UsersService.getInstance();
const investmentsService = InvestmentsService.getInstance();
const researchContentService = ResearchContentService.getInstance();
const grantsService = GrantsService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const state = {
  research: null,
  researchRef: null,
  group: null,
  allContentsList: [],
  applicationsList: [],
  researchGroupMembersList: [],
  reviewsList: [],
  disciplinesList: [],
  tokenSale: undefined,
  tokenSalesList: [],
  tokenHoldersList: [],
  contributionsList: [],
  groupInvitesList: [],
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
};

// getters
const getters = {

  research: (state, getters) => state.research,

  researchRef: (state, getters) => state.research.researchRef,

  group: () => state.group,

  contentList: (state, getters) => {
    return state.allContentsList
      .filter((researchContent) => !researchContent.isDraft)
  },

  draftsList: (state, getters) => {
    return state.allContentsList
      .filter((researchContent) => researchContent.isDraft)
      .map((researchContent) => { return { ...researchContent.researchContentRef } });
  },

  applicationsList: (state, getters) => state.applicationsList,

  researchGroupMembersList: (state, getters) => state.researchGroupMembersList,

  researchMembersList: (state, getters) => state.researchGroupMembersList
    .filter((member) => state.research.members.some((m) => m == member.account.name)),

  reviewsList: (state, getters) => state.reviewsList.map((review, i) => {
    const researchContent = getters.contentList.find((content) => content.id == review.research_content_id);
    return {
      ...review,
      researchContent
    };
  })
    .sort((a, b) => b.id - a.id),

  disciplinesList: (state, getters) => state.disciplinesList,

  tokenSale: (state, getters) => state.tokenSale,

  tokenSalesList: (state, getters) => state.tokenSalesList,

  tokenHoldersList: (state, getters) => state.tokenHoldersList,

  contributionsList: (state, getters) => state.contributionsList,

  groupInvitesList: (state, getters) => state.groupInvitesList,

  expertsList: (state, getters) => state.expertsList,

  isLoadingResearchContent: (state, getters) => state.isLoadingResearchContent,

  isLoadingResearchMembers: (state, getters) => state.isLoadingResearchMembers,

  isLoadingResearchDetails: (state, getters) => state.isLoadingResearchDetails,

  isLoadingResearchReviews: (state, getters) => state.isLoadingResearchReviews,

  isLoadingResearchDisciplines: (state, getters) => state.isLoadingResearchDisciplines,

  isLoadingResearchTokenHolders: (state, getters) => state.isLoadingResearchTokenHolders,

  isLoadingResearchTokenSale: (state, getters) => state.isLoadingResearchTokenSale,

  isLoadingResearchContentRefs: (state, getters) => state.isLoadingResearchContentRefs,

  timelineOffsets(state, getters) {
    if (state.research !== null && getters.contentList !== null
      && getters.contentList.length !== 0) {
      const startTimestamp = Date.parse(state.research.created_at);
      const endTimestamp = Date.parse(getters.contentList[getters.contentList.length - 1].created_at);
      const allTime = endTimestamp - startTimestamp;

      const offsets = [];
      // the end of timeline can be reached for finished research only
      const maxRatio = state.research.is_finished ? 100 : 70;
      for (let i = 0; i < getters.contentList.length; i++) {
        const contentTimestamp = Date.parse(getters.contentList[i].created_at);

        // calculate item ratio by its index
        const indexFactor = (i + 1) / getters.contentList.length * maxRatio;

        // calculate item ratio by its timestamp
        var timestampFactor;
        if (allTime === 0) {
          // all research content have been posted at the same time (genesis)
          timestampFactor = i == getters.contentList.length - 1 ? maxRatio : 50;
        } else {
          const timeAfter = endTimestamp - contentTimestamp;
          timestampFactor = 100 - (timeAfter / allTime * 100) || 1;
        }

        // adjust position relative to entire timeline period
        const ratio = (indexFactor * timestampFactor) / 100;
        offsets.push({ value: ratio.toFixed(2) });
      }

      return offsets;
    }
    return [];
  },

  userContributionsList: (state, getters) => state.userContributionsList,

};

// actions
const actions = {

  loadResearchDetails({ state, commit, dispatch }, { group_permlink, research_permlink }) {
    commit('RESET_STATE');
    commit('SET_RESEARCH_DETAILS_LOADING_STATE', true);

    // TODO: replace permliks with external_id in routes
    return deipRpc.api.getResearchByAbsolutePermlinkAsync(group_permlink, research_permlink)
      .then((research) => researchService.getResearch(research.external_id))
      .then((research) => {
        research.isTop = researchService.getTopResearchesIds().some((id) => id == research.id);
        commit('SET_RESEARCH_DETAILS', research);

        const researchContentLoad = new Promise((resolve, reject) => {
          dispatch('loadResearchContent', {
            researchExternalId: state.research.external_id,
            notify: resolve
          });
        });
        const membersLoad = new Promise((resolve, reject) => {
          dispatch('loadResearchMembers', {
            groupId: state.research.research_group_id,
            notify: resolve
          });
        });
        const reviewsLoad = new Promise((resolve, reject) => {
          dispatch('loadResearchReviews', {
            researchExternalId: state.research.external_id,
            notify: resolve
          });
        });
        const disciplinesLoad = new Promise((resolve, reject) => {
          dispatch('loadResearchDisciplines', {
            researchId: state.research.id,
            notify: resolve
          });
        });
        const tokenHoldersLoad = new Promise((resolve, reject) => {
          dispatch('loadResearchTokenHolders', {
            researchId: state.research.id,
            notify: resolve
          });
        });
        const tokenSaleLoad = new Promise((resolve, reject) => {
          dispatch('loadResearchTokenSale', {
            researchId: state.research.id,
            notify: resolve
          });
        });
        const tokenSalesLoad = new Promise((resolve, reject) => {
          dispatch('loadResearchTokenSales', {
            researchId: state.research.id,
            notify: resolve
          });
        });
        const groupLoad = new Promise((resolve, reject) => {
          dispatch('loadResearchGroupDetails', {
            group_permlink,
            notify: resolve
          });
        });
        const applicationsLoad = new Promise((resolve, reject) => {
          dispatch('loadResearchApplications', {
            researchId: state.research.id,
            notify: resolve
          });
        });

        const userContributionsLoad = new Promise((resolve, reject) => {
          dispatch('loadUserContributions', {
            researchId: state.research.id,
            notify: resolve
          });
        });

        return Promise.all([
          researchContentLoad, membersLoad, reviewsLoad, disciplinesLoad, tokenHoldersLoad,
          tokenSaleLoad, tokenSalesLoad, groupLoad,
          applicationsLoad, userContributionsLoad
        ]);
      }, ((err) => { console.error(err); }))
      .finally(() => {
        commit('SET_RESEARCH_DETAILS_LOADING_STATE', false);
      });
  },

  loadResearchContent({ state, dispatch, commit }, { researchExternalId, notify }) {
    const researchContents = [];
    commit('SET_RESEARCH_CONTENT_LOADING_STATE', true);

    return researchContentService.getResearchContentByResearch(researchExternalId)
      .then((list) => {
        researchContents.push(...list);
        return Promise.all(researchContents.map((content) => deipRpc.api.getReviewsByResearchContentAsync(content.external_id)));
      })
      .then((reviews) => {
        researchContents.forEach((content, index) => {
          content.reviews = reviews[index];
        });

        commit('SET_RESEARCH_CONTENT_LIST', researchContents);
      })
      .catch((err) => { console.error(err); })
      .finally(() => {
        commit('SET_RESEARCH_CONTENT_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadResearchApplications({ state, dispatch, commit }, { researchId, notify }) {
    let applications = [];
    commit('SET_RESEARCH_APPLICATONS_LOADING_STATE', true);

    deipRpc.api.getGrantApplicationsByResearchIdAsync(researchId)
      .then((list) => {
        applications = list;
        return Promise.all(applications.map((a) => deipRpc.api.getFundingOpportunityAsync(a.grant_id)));
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
      .catch((err) => { console.error(err); })
      .finally(() => {
        commit('SET_RESEARCH_APPLICATONS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadResearchMembers({ state, commit, dispatch }, { groupId, notify }) {
    const rgtList = [];
    commit('SET_RESEARCH_MEMBERS_LOADING_STATE', true);
    deipRpc.api.getResearchGroupTokensByResearchGroupAsync(groupId)
      .then((members) => {
        rgtList.push(...members);
        return usersService.getEnrichedProfiles(members.map((m) => m.owner));
      }, (err) => { console.error(err); })
      .then((users) => {
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          user.rgt = rgtList.find((rgt) => rgt.owner == user.account.name);
        }
        commit('SET_RESEARCH_MEMBERS_LIST', users);
      }, (err) => { console.error(err); })
      .finally(() => {
        commit('SET_RESEARCH_MEMBERS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadResearchReviews({ state, dispatch, commit }, { researchExternalId, notify }) {
    const reviews = [];
    commit('SET_RESEARCH_REVIEWS_LOADING_STATE', true);

    deipRpc.api.getReviewsByResearchAsync(researchExternalId)
      .then((items) => {
        reviews.push(...items);
        return Promise.all([
          Promise.all(reviews.map((item) => deipRpc.api.getReviewVotesByReviewIdAsync(item.id))),
          usersService.getEnrichedProfiles(reviews.map((r) => r.author))
        ]);
      }, (err) => { console.error(err); })
      .then(([reviewVotes, users]) => {
        reviews.forEach((review, i) => {
          review.author = users.find((u) => u.account.name == review.author);
          review.votes = reviewVotes[i];
          review.supporters = reviewVotes[i].reduce((arr, vote) => (arr.some(({ voter }) => voter === vote.voter) ? arr : [...arr, vote]), []);
        });
        commit('SET_RESEARCH_REVIEWS_LIST', reviews);
      }, (err) => { console.error(err); })
      .finally(() => {
        commit('SET_RESEARCH_REVIEWS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadResearchDisciplines({ state, dispatch, commit }, { researchId, notify }) {
    const disciplinesList = [];
    commit('SET_RESEARCH_DISCIPLINES_LOADING_STATE', true);

    deipRpc.api.getDisciplinesByResearchAsync(researchId)
      .then((data) => {
        const expertsPromises = [];

        for (let i = 0; i < data.length; i++) {
          const discipline = data[i];
          disciplinesList.push(discipline);
          expertsPromises.push(deipRpc.api.getExpertTokensByDisciplineAsync(discipline.external_id));
        }

        return Promise.all([
          Promise.all(expertsPromises)
        ]);
      }, (err) => { console.error(err); })
      .then(([expertTokensPerDiscipline]) => {
        const expertsAccountNames = [];
        expertTokensPerDiscipline.forEach((e) => {
          expertsAccountNames.push(...e.map((et) => et.account_name));
        });
        commit('SET_RESEARCH_DISCIPLINES_LIST', disciplinesList);
        return usersService.getEnrichedProfiles(_.uniq(expertsAccountNames));
      }, (err) => { console.error(err); })
      .then((expertsList) => {
        commit('SET_EXPERTS_LIST', expertsList);
      })
      .finally(() => {
        commit('SET_RESEARCH_DISCIPLINES_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadResearchTokenHolders({ state, dispatch, commit }, { researchId, notify }) {
    const tokenHolders = [];
    commit('SET_RESEARCH_TOKEN_HOLDERS_LOADING_STATE', true);
    deipRpc.api.getResearchTokensByResearchIdAsync(researchId)
      .then((rtList) => {
        tokenHolders.push(...rtList);
        return usersService.getEnrichedProfiles(tokenHolders.map((m) => m.account_name));
      }, (err) => { console.error(err); })
      .then((users) => {
        for (let i = 0; i < tokenHolders.length; i++) {
          const holder = tokenHolders[i];
          holder.user = users.find((user) => holder.account_name == user.account.name);
        }
        commit('SET_RESEARCH_TOKEN_HOLDERS_LIST', tokenHolders);
      })
      .finally(() => {
        commit('SET_RESEARCH_TOKEN_HOLDERS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadResearchTokenSale({ state, dispatch, commit }, { researchId, notify }) {
    commit('SET_RESEARCH_TOKEN_SALE_LOADING_STATE', true);

    return investmentsService.getCurrentTokenSaleByResearchId(researchId)
      .then((tokenSale) => {
        commit('SET_RESEARCH_TOKEN_SALE', tokenSale);

        if (tokenSale) {
          return dispatch('loadTokenSaleContributors');
        }
        commit('SET_RESEARCH_TOKEN_SALE_CONTRIBUTIONS_LIST', []);
      }, (err) => { console.error(err); })
      .finally(() => {
        commit('SET_RESEARCH_TOKEN_SALE_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadResearchTokenSales({ state, dispatch, commit }, { researchId, notify }) {
    return deipRpc.api.getResearchTokenSalesByResearchIdAsync(researchId)
      .then((tokenSales) => {
        commit('SET_RESEARCH_TOKEN_SALES', tokenSales);
      }, (err) => { console.error(err); })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadTokenSaleContributors({ state, commit }) {
    const contributors = [];
    return deipRpc.api.getResearchTokenSaleContributionsByResearchTokenSaleIdAsync(state.tokenSale.id)
      .then((contributions) => {
        contributors.push(...contributions);
        return usersService.getEnrichedProfiles(contributions.map((m) => m.owner));
      })
      .then((users) => {
        for (let i = 0; i < contributors.length; i++) {
          const contributor = contributors[i];
          contributor.user = users.find((user) => contributor.owner == user.account.name);
        }
        commit('SET_RESEARCH_TOKEN_SALE_CONTRIBUTIONS_LIST', contributors);
      });
  },

  loadResearchGroupDetails({ state, commit, dispatch }, { group_permlink, notify }) {
    commit('SET_RESEARCH_GROUP_DETAILS_LOADING_STATE', true);
    deipRpc.api.getResearchGroupByPermlinkAsync(group_permlink)
      .then((group) => {
        commit('SET_RESEARCH_GROUP_DETAILS', group);
      }, (err) => { console.error(err); })
      .finally(() => {
        commit('SET_RESEARCH_GROUP_DETAILS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadUserContributions({ state, commit, rootGetters }, { researchId, notify }) {
    const user = rootGetters['auth/user'];
    const loadPromise = !accessService.isLoggedIn()
      ? Promise.resolve()
      : deipRpc.api.getContributionsHistoryByContributorAndResearchAsync(user.account.name, researchId)
        .then((hist) => {
          const contributions = hist.map((h) => ({
            tokenSaleId: h.op[1].research_token_sale_id,
            amount: h.op[1].amount
          }));
          commit('SET_USER_CONTRIBUTIONS_LIST', contributions);
        });
    return loadPromise.finally(() => {
      if (notify) notify();
    });
  },
};

// mutations
const mutations = {

  SET_RESEARCH_DETAILS(state, research) {
    state.research = research;
  },

  SET_RESEARCH_MEMBERS_LIST(state, list) {
    state.researchGroupMembersList = list;
  },

  SET_RESEARCH_CONTENT_LIST(state, list) {
    state.allContentsList = list;
  },

  SET_RESEARCH_APPLICATIONS_LIST(state, applications) {
    state.applicationsList = applications;
  },

  SET_RESEARCH_REVIEWS_LIST(state, list) {
    state.reviewsList = list;
  },

  SET_RESEARCH_DISCIPLINES_LIST(state, list) {
    state.disciplinesList = list;
  },

  SET_RESEARCH_TOKEN_SALE(state, tokenSale) {
    state.tokenSale = tokenSale;
  },

  SET_RESEARCH_TOKEN_SALES(state, list) {
    state.tokenSalesList = list;
  },

  SET_RESEARCH_TOKEN_HOLDERS_LIST(state, tokenHolders) {
    state.tokenHoldersList = tokenHolders;
  },

  SET_RESEARCH_TOKEN_SALE_CONTRIBUTIONS_LIST(state, contributions) {
    state.contributionsList = contributions;
  },

  SET_RESEARCH_GROUP_INVITES(state, invites) {
    state.groupInvitesList = invites;
  },

  SET_RESEARCH_APPLICATIONS_REFS(state, refs) {
    state.applicationsRefsList = refs;
  },

  SET_USER_CONTRIBUTIONS_LIST(state, list) {
    state.userContributionsList = list;
  },

  SET_EXPERTS_LIST(state, list) {
    state.expertsList = list;
  },

  SET_RESEARCH_DETAILS_LOADING_STATE(state, value) {
    state.isLoadingResearchDetails = value;
  },

  SET_RESEARCH_MEMBERS_LOADING_STATE(state, value) {
    state.isLoadingResearchMembers = value;
  },

  SET_RESEARCH_CONTENT_LOADING_STATE(state, value) {
    state.isLoadingResearchContent = value;
  },

  SET_RESEARCH_APPLICATONS_LOADING_STATE(state, value) {
    state.isLoadingResearchApplications = value;
  },

  SET_RESEARCH_REVIEWS_LOADING_STATE(state, value) {
    state.isLoadingResearchReviews = value;
  },

  SET_RESEARCH_DISCIPLINES_LOADING_STATE(state, value) {
    state.isLoadingResearchDisciplines = value;
  },

  SET_RESEARCH_TOKEN_HOLDERS_LOADING_STATE(state, value) {
    state.isLoadingResearchTokenHolders = value;
  },

  SET_RESEARCH_TOKEN_SALE_LOADING_STATE(state, value) {
    state.isLoadingResearchTokenSale = value;
  },

  SET_RESEARCH_CONTENT_REFS_LOADING_STATE(state, value) {
    state.isLoadingResearchContentRefs = value;
  },

  SET_RESEARCH_APPLICATIONS_REFS_LOADING_STATE(state, value) {
    state.isLoadingResearchApplicationsRefs = value;
  },

  SET_RESEARCH_GROUP_DETAILS_LOADING_STATE(state, value) {
    state.isLoadingResearchGroupDetails = value;
  },

  SET_RESEARCH_GROUP_DETAILS(state, value) {
    state.group = value;
  },

  RESET_STATE(state) {

  }
};

const namespaced = true;


export const rdStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
