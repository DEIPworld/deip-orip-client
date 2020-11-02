import Vue from 'vue';
import deipRpc from '@deip/rpc-client';

import { UsersService } from '@deip/users-service';
import { ResearchService } from '@deip/research-service';
import { ResearchGroupService } from '@deip/research-group-service';
import { InvestmentsService } from '@deip/investments-service';
import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';

const usersService = UsersService.getInstance();
const researchService = ResearchService.getInstance();
const researchGroupService = ResearchGroupService.getInstance();
const investmentsService = InvestmentsService.getInstance();
const researchContentReviewsService = ResearchContentReviewsService.getInstance();

const state = {
  isLoadingDashboardPage: false,

  investedResearches: [],
  investedResearchShares: [],

  investingResearches: [],
  investingResearchesOngoingTokenSales: [],
  investingResearchesOngoingTokenSalesContributions: [],

  myMembershipResearches: [],
  myMembershipResearchesOngoingTokenSales: [],
  myMembershipResearchesOngoingTokenSalesContributions: [],

  bookmarkedResearches: [],
  bookmarkedResearchesOngoingTokenSales: [],
  bookmarkedResearchesOngoingTokenSalesContributions: [],

  researchGroups: [],
  researchGroupsTokens: [],
  researchGroupsMembers: [],

  expertsList: [],
  expertsExpertiseTokensList: [],

  myInvitesList: [],
  myReviewRequests: [],
  myReviews: []

};

// getters
const getters = {
  isLoadingDashboardPage: (state) => state.isLoadingDashboardPage,

  researches: (state) => {
    const unique = [
      ...state.investedResearches,
      ...state.investingResearches,
      ...state.myMembershipResearches,
      ...state.bookmarkedResearches
    ]
      .reduce((acc, research) => {
        if (acc.some((a) => a.research.id == research.id)) return acc;

        const researchMembers = state.researchGroupsMembers
          .filter((member) => research.members.some((name) => name == member.account.name));

        const tokenSale = [
          ...state.investingResearchesOngoingTokenSales,
          ...state.myMembershipResearchesOngoingTokenSales,
          ...state.bookmarkedResearchesOngoingTokenSales
        ]
          .find((s) => s.research_id == research.id);

        const group = state.researchGroups.find((rg) => rg.id === research.research_group_id);
        const isTop = researchService.getTopResearchesIds().some((id) => id === research.id);

        if (tokenSale) {
          const tokenSaleContributions = [
            ...state.investingResearchesOngoingTokenSalesContributions,
            ...state.myMembershipResearchesOngoingTokenSalesContributions,
            ...state.bookmarkedResearchesOngoingTokenSalesContributions
          ]
            .reduce((acc, tokenSale) => {
              if (acc.some((ts) => ts.id.id == tokenSale.id)) return acc;
              return [tokenSale, ...acc];
            }, [])
            .filter((c) => c.research_token_sale_id == tokenSale.id);

          return [...acc, {
            research: { ...research, isTop },
            authors: researchMembers,
            group,
            tokenSale,
            tokenSaleContributions
          }];
        }
        return [...acc, { research: { ...research, isTop }, authors: researchMembers, group }];
      }, []);

    unique.sort((a, b) => ((a.research.title > b.research.title) ? 1 : ((b.research.title > a.research.title) ? -1 : 0)));
    return unique;
  },

  myMembershipAndBookmarkedResearches: (state) => {
    const unique = [
      ...state.myMembershipResearches.map((item) => ({ ...item, is_following: false })),
      ...state.bookmarkedResearches.map((item) => ({ ...item, is_following: true }))
    ]
      .reduce((acc, research) => {
        if (acc.some((a) => a.research.id == research.id)) return acc;

        const researchMembers = state.researchGroupsMembers
          .filter((member) => research.members.some((name) => name == member.account.name));

        const group = state.researchGroups.find((rg) => rg.id === research.research_group_id);
        const isTop = researchService.getTopResearchesIds().some((id) => id == research.id);

        return [...acc, { research: { ...research, isTop }, authors: researchMembers, group }];
      }, []);

    unique.sort((a, b) => ((a.research.title > b.research.title) ? 1 : ((b.research.title > a.research.title) ? -1 : 0)));
    return unique;
  },

  investments: (state) => state.investedResearches,

  reviewsOnMyResearchCount: (state, getters) => getters.researches.reduce((acc, { research }) => acc + research.number_of_negative_reviews + research.number_of_positive_reviews, 0),

  reviewsOnMyRequestsCount: (state, getters) => {
    const approvedReviews = state.myReviewRequests.filter((req) => req.status == 'approved');
    return approvedReviews.length;
  },

  myInvitesCount: (state, getters) => state.myInvitesList.length,

  myReviewsCount: (state) => state.myReviews.length,

  currentShares: (state) => state.investedResearchShares
    .map((share) => {
      const research = state.investedResearches.find((r) => r.id == share.research_id);
      return { share, research };
    })
    .filter((share) => !!share.research),

  experts: (state) => state.expertsList.map((expert) => {
    const expertiseTokens = state.expertsExpertiseTokensList.filter((exp) => exp.account_name == expert.account.name);
    return { ...expert, expertiseTokens };
  })
};

// actions
const actions = {
  loadDashboardPage({ commit, dispatch, state }, { username }) {
    commit('SET_DASHBOARD_PAGE_LOADING_STATE', true);

    const investedResearchesLoad = new Promise((resolve, reject) => {
      dispatch('loadInvestedResearches', { username, notify: resolve });
    });
    const investingResearchesLoad = new Promise((resolve, reject) => {
      dispatch('loadInvestingResearches', { username, notify: resolve });
    });
    const membershipResearchesLoad = new Promise((resolve, reject) => {
      dispatch('loadMembershipResearches', { username, notify: resolve });
    });
    const expertsLoad = new Promise((resolve, reject) => {
      dispatch('loadExperts', { username, notify: resolve });
    });
    const myReviewRequestsLoad = new Promise((resolve, reject) => {
      dispatch('loadMyReviewRequests', { username, notify: resolve });
    });
    const myReviewsLoad = new Promise((resolve, reject) => {
      dispatch('loadMyReviews', { username, notify: resolve });
    });

    return Promise.all([
      investedResearchesLoad,
      investingResearchesLoad,
      membershipResearchesLoad,
      expertsLoad,
      myReviewRequestsLoad,
      myReviewsLoad
    ])
      .then(() => {
        const pulled = [
          ...state.investedResearches,
          ...state.investingResearches,
          ...state.myMembershipResearches
        ].map((research) => research.external_id);

        const bookmarkedResearchesLoad = new Promise((resolve, reject) => {
          dispatch('loadBookmarkedResearches', { username, excludeIds: pulled, notify: resolve });
        });
        return Promise.all([
          bookmarkedResearchesLoad
        ]);
      })
      .then(() => {
        const rgtPromises = [];
        const rgPromises = [];

        [
          ...state.investedResearches,
          ...state.investingResearches,
          ...state.myMembershipResearches,
          ...state.bookmarkedResearches
        ].reduce((unique, research) => {
          if (unique.some((researchExternalId) => researchExternalId == research.external_id)) return unique;
          return [research.external_id, ...unique];
        }, []);

        [
          ...state.investedResearches,
          ...state.investingResearches,
          ...state.myMembershipResearches,
          ...state.bookmarkedResearches
        ].reduce((unique, research) => {
          if (unique.some((rgId) => rgId == research.research_group_id)) return unique;
          return [research.research_group_id, ...unique];
        }, []).forEach((rgId) => {
          rgtPromises.push(deipRpc.api.getResearchGroupTokensByResearchGroupAsync(rgId));
          rgPromises.push(researchGroupService.getResearchGroupById(rgId));
        });

        return Promise.all([
          Promise.all(rgtPromises),
          Promise.all(rgPromises)
        ]);
      })
      .then(([researchGroupsTokens, researchGroups]) => {
        const tokens = [].concat.apply([], researchGroupsTokens);
        commit('SET_RESEARCH_GROUPS_TOKENS', tokens);
        commit('SET_RESEARCH_GROUPS', researchGroups);
        return usersService.getEnrichedProfiles(tokens.reduce((unique, rt) => {
          if (unique.some((name) => name == rt.owner)) return unique;
          return [rt.owner, ...unique];
        }, []));
      })
      .then((researchGroupsMembers) => {
        commit('SET_RESEARCH_GROUPS_MEMBERS', researchGroupsMembers);
      })
      .finally(() => {
        commit('SET_DASHBOARD_PAGE_LOADING_STATE', false);
      });
  },

  loadInvestedResearches({ commit }, { username, notify } = {}) {
    return deipRpc.api.getResearchTokensByAccountNameAsync(username)
      .then((shares) => {
        commit('SET_INVESTED_RESEARCH_SHARES', shares);
        return Promise.all(shares.map((s) => researchService.getResearch(s.research_external_id)));
      })
      .then((items) => {
        const researches = items.filter((r) => !!r);
        commit('SET_INVESTED_RESEARCHES', researches);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadInvestingResearches({ commit }, { username, notify } = {}) {
    return deipRpc.api.getResearchTokenSaleContributionsByContributorAsync(username)
      .then((contributions) => {
        commit('SET_INVESTING_RESEARCHES_ONGOING_TOKEN_SALES_CONTRIBUTIONS', contributions);
        return Promise.all(contributions.map((c) => deipRpc.api.getResearchTokenSaleByIdAsync(c.research_token_sale_id)));
      })
      .then((sales) => {
        commit('SET_INVESTING_RESEARCHES_ONGOING_TOKEN_SALES', sales);
        return Promise.all(sales.map((s) => researchService.getResearch(s.research_external_id)));
      })
      .then((items) => {
        const researches = items.filter((r) => !!r);
        commit('SET_INVESTING_RESEARCHES_TOKEN_SALES', researches);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadMembershipResearches({ commit }, { username, notify } = {}) {
    return researchService.getUserResearchListing(username)
      .then((items) => {
        const researches = [].concat.apply([], items);
        commit('SET_MY_MEMBERSHIP_RESEARCHES', researches);
        return Promise.all(researches.map((research) => investmentsService.getCurrentTokenSaleByResearch(research.external_id)));
      })
      .then((response) => {
        const sales = response.filter((ts) => ts !== undefined);
        commit('SET_MY_MEMBERSHIP_RESEARCHES_ONGOING_TOKEN_SALES', sales);
        return Promise.all(sales.map((ts) => deipRpc.api.getResearchTokenSaleContributionsByResearchTokenSaleIdAsync(ts.id)));
      })
      .then((response) => {
        const contributions = [].concat.apply([], response);
        commit('SET_MY_MEMBERSHIP_RESEARCHES_ONGOING_TOKEN_SALES_CONTRIBUTIONS', contributions);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadBookmarkedResearches({ commit, rootGetters }, { excludeIds, notify } = { excludeIds: [] }) {
    const user = rootGetters['auth/user'];

    const externalIds = user.researchBookmarks.map((b) => b.researchId).filter((id) => !excludeIds.some((rId) => rId == id));
    return Promise.all(externalIds.map((externalId) => researchService.getResearch(externalId)))
      .then((items) => {
        const researches = items.filter((r) => !!r);
        commit('SET_BOOKMARKED_RESEARCHES', researches);
        return Promise.all(researches.map((research) => investmentsService.getCurrentTokenSaleByResearch(research.external_id)));
      })
      .then((response) => {
        const sales = response.filter((ts) => ts !== undefined);
        commit('SET_BOOKMARKED_RESEARCHES_ONGOING_TOKEN_SALES', sales);
        return Promise.all(sales.map((ts) => deipRpc.api.getResearchTokenSaleContributionsByResearchTokenSaleIdAsync(ts.id)));
      })
      .then((response) => {
        const contributions = [].concat.apply([], response);
        commit('SET_BOOKMARKED_RESEARCHES_ONGOING_TOKEN_SALES_CONTRIBUTIONS', contributions);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadExperts({ commit }, { username, notify } = {}) {
    // TODO: request server for tenant users
    deipRpc.api.lookupAccountsAsync('0', 10000)
      .then((accounts) => {
        const blackList = ['regacc', 'hermes', 'initdelegate', username];
        const experts = accounts.filter((a) => !a.is_research_group && !blackList.some((username) => username === a.name)).map((a) => a.name);
        return usersService.getEnrichedProfiles(experts);
      })
      .then((users) => {
        commit('SET_EXPERTS', users);
        return Promise.all(users.map((user) => deipRpc.api.getExpertTokensByAccountNameAsync(user.account.name)));
      })
      .then((tokens) => {
        const flatten = [].concat.apply([], tokens);
        commit('SET_EXPERTS_EXPERTISE_TOKENS', flatten);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadMyReviewRequests({ commit }, { username, notify } = {}) {
    return researchContentReviewsService.getReviewRequestsByRequestor(username)
      .then((reviews) => {
        commit('SET_MY_REVIEW_REQUESTS', reviews);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadMyReviews({ commit }, { username, notify } = {}) {
    return deipRpc.api.getReviewsByAuthorAsync(username)
      .then((reviews) => {
        commit('SET_MY_REVIEWS', reviews);
      }).finally(() => {
        if (notify) notify();
      });
  }

};

// mutations
const mutations = {
  SET_DASHBOARD_PAGE_LOADING_STATE(state, value) {
    state.isLoadingDashboardPage = value;
  },

  SET_INVESTED_RESEARCH_SHARES(state, list) {
    state.investedResearchShares = list;
  },

  SET_INVESTED_RESEARCHES(state, list) {
    state.investedResearches = list;
  },

  SET_INVESTING_RESEARCHES_ONGOING_TOKEN_SALES_CONTRIBUTIONS(state, list) {
    state.investingResearchesOngoingTokenSalesContributions = list;
  },

  SET_INVESTING_RESEARCHES_ONGOING_TOKEN_SALES(state, list) {
    state.investingResearchesOngoingTokenSales = list;
  },

  SET_INVESTING_RESEARCHES_TOKEN_SALES(state, list) {
    state.investingResearches = list;
  },

  SET_MY_MEMBERSHIP_RESEARCHES(state, list) {
    state.myMembershipResearches = list;
  },

  SET_MY_MEMBERSHIP_RESEARCHES_ONGOING_TOKEN_SALES(state, list) {
    state.myMembershipResearchesOngoingTokenSales = list;
  },

  SET_MY_MEMBERSHIP_RESEARCHES_ONGOING_TOKEN_SALES_CONTRIBUTIONS(state, list) {
    state.myMembershipResearchesOngoingTokenSalesContributions = list;
  },

  SET_RESEARCH_GROUPS_TOKENS(state, list) {
    state.researchGroupsTokens = list;
  },

  SET_RESEARCH_GROUPS(state, list) {
    state.researchGroups = list;
  },

  SET_RESEARCH_GROUPS_MEMBERS(state, list) {
    state.researchGroupsMembers = list;
  },

  SET_EXPERTS(state, list) {
    state.expertsList = list;
  },

  SET_EXPERTS_EXPERTISE_TOKENS(state, list) {
    state.expertsExpertiseTokensList = list;
  },

  SET_BOOKMARKED_RESEARCHES(state, list) {
    state.bookmarkedResearches = list;
  },

  SET_BOOKMARKED_RESEARCHES_ONGOING_TOKEN_SALES(state, list) {
    state.bookmarkedResearchesOngoingTokenSales = list;
  },

  SET_BOOKMARKED_RESEARCHES_ONGOING_TOKEN_SALES_CONTRIBUTIONS(state, list) {
    state.bookmarkedResearchesOngoingTokenSalesContributions = list;
  },

  SET_MY_INVITES(state, list) {
    state.myInvitesList = list;
  },

  SET_MY_REVIEW_REQUESTS(state, list) {
    state.myReviewRequests = list;
  },

  SET_MY_REVIEWS(state, list) {
    state.myReviews = list;
  }
};

const namespaced = true;

export const dashboardStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
