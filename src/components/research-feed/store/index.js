import Vue from 'vue';
import deipRpc from '@deip/rpc-client';

import { ResearchService } from '@deip/research-service';
import { UsersService } from '@deip/users-service';
import { InvestmentsService } from '@deip/investments-service';
import { ResearchGroupService } from '@deip/research-group-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';

const researchService = ResearchService.getInstance();
const usersService = UsersService.getInstance();
const investmentsService = InvestmentsService.getInstance();
const researchGroupService = ResearchGroupService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const state = {
  fullResearchListing: [],
  feedResearchReviews: [],
  feedResearchGroups: [],
  feedResearchGroupsMembers: [],
  feedDisciplinesStatistics: [],
  feedResearchTokenSales: [],
  feedResearchTokenSalesContributions: []

};

// getters
const getters = {
  fullResearchListing: (state) => state.fullResearchListing,

  researchFeed: (state, getters) => {
    const ordered = state.fullResearchListing
      .map((item) => {
        const isTop = researchService.getTopResearchesIds().some((id) => id == item.id);
        return { ...item, isTop };
      })
      .map((item) => {
        const reviews = state.feedResearchReviews.filter((review) => review.research_id === item.id);
        const group = state.feedResearchGroups.find((group) => group.external_id === item.research_group.external_id);
        const researchMembers = state.feedResearchGroupsMembers.filter((user) => item.members.some((a) => a === user.account.name));
        const tokenSale = state.feedResearchTokenSales.find((tokenSale) => tokenSale.research_id === item.id);
        const tokenSaleContributions = tokenSale ? state.feedResearchTokenSalesContributions.filter((c) => c.research_token_sale_id === tokenSale.id) : [];
        const disciplines = item.disciplines.map((discipline) => ({ ...discipline }));
        return {
          ...item,
          reviews,
          group,
          authors: researchMembers,
          tokenSale,
          tokenSaleContributions,
          disciplines
        };
      });
    // .sort((a, b) => {
    //   if (b.created_at > a.created_at) {
    //     return 1
    //   }

    //   return -1;
    // });

    return ordered;
  },

  organizations: (state) => state.feedResearchGroups.filter((g) => !g.is_personal)
};

// actions
const actions = {

  loadResearchFeed({state, dispatch, commit, rootGetters}, { filter = {} }) {
    const { username } = rootGetters['auth/user'];

    const fullResearchListing = [];
    return researchService.getPublicResearchListing(filter)
      .then((listing) => {
        fullResearchListing.push(...listing.map((item) => ({ ...item, isCollapsed: true })));

        const researchReviewsLoad = Promise.all(listing
          .map((r) => deipRpc.api.getReviewsByResearchAsync(r.external_id)
            .then((reviews) => reviews.map((review) => ({ ...review, research_id: r.id })))));

        const researchGroupsLoad = Promise.all(listing
          .map((r) => r.research_group.external_id)
          .reduce((acc, externalId) => (acc.some((g) => g == externalId) ? acc : [externalId, ...acc]), [])
          .map((externalId) => researchGroupService.getResearchGroup(externalId)));

        const groupsMembersLoad = usersService.getEnrichedProfiles(listing
          .map((r) => r.members)
          .reduce((acc, members) => {
            const unique = members.filter((name) => !acc.some((a) => a == name));
            return [...unique, ...acc];
          }, []));

        const tokenSalesLoad = Promise.all(listing
          .map((r) => investmentsService.getCurrentTokenSaleByResearchId(r.id)));

        return Promise.all([
          researchReviewsLoad,
          researchGroupsLoad,
          groupsMembersLoad,
          tokenSalesLoad
        ]);
      })
      .then(([researchReviews, groups, /* disciplinesStats, */ groupsMembers, tokenSales]) => {
        commit('SET_FULL_RESEARCH_LISTING', fullResearchListing);
        commit('SET_RESEARCH_FEED_REVIEWS_LIST', [].concat.apply([], researchReviews));
        commit('SET_RESEARCH_FEED_GROUPS_LIST', groups);
        commit('SET_RESEARCH_FEED_GROUPS_MEMBERS_LIST', groupsMembers);
        commit('SET_RESEARCH_FEED_TOKEN_SALES_LIST', tokenSales.filter((ts) => ts != undefined));

        const tokenSalesContributionsLoad = Promise.all(state.feedResearchTokenSales
          .map((tokenSale) => deipRpc.api.getResearchTokenSaleContributionsByResearchTokenSaleIdAsync(tokenSale.id)));

        return Promise.all([
          tokenSalesContributionsLoad
        ]);
      })
      .then((tokenSalesContributions) => {
        commit('SET_RESEARCH_FEED_TOKEN_SALES_CONTRIBUTIONS_LIST', [].concat.apply([], [].concat.apply([], tokenSalesContributions)));

        return fullResearchListing;
      });
  }
};

// mutations
const mutations = {

  SET_FULL_RESEARCH_LISTING(state, list) {
    state.fullResearchListing = list;
  },

  SET_RESEARCH_FEED_REVIEWS_LIST(state, list) {
    state.feedResearchReviews = list;
  },

  SET_RESEARCH_FEED_GROUPS_LIST(state, list) {
    state.feedResearchGroups = list;
  },

  SET_RESEARCH_FEED_GROUPS_MEMBERS_LIST(state, list) {
    state.feedResearchGroupsMembers = list;
  },

  SET_RESEARCH_FEED_TOKEN_SALES_LIST(state, list) {
    state.feedResearchTokenSales = list;
  },

  SET_RESEARCH_FEED_TOKEN_SALES_CONTRIBUTIONS_LIST(state, list) {
    state.feedResearchTokenSalesContributions = list;
  }
};

const namespaced = true;

export const feedStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
