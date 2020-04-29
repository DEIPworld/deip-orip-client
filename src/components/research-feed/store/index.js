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
  feedTotalVotes: [],
  feedResearchReviews: [],
  feedResearchGroups: [],
  feedResearchGroupsMembers: [],
  feedDisciplinesStatistics: [],
  feedResearchTokenSales: [],
  feedResearchTokenSalesContributions: [],

  filter: {
    disciplines: [],
    trl: [],
    organizations: [],
    q: '',
    orderBy: {
      iteratee: ['title'],
      order: ['asc']
    },
    topOnly: false,
    dateFrom: null,
    dateTo: null
  }

};

// getters
const getters = {

  filter: (state, getters) => state.filter,

  researchFeed: (state, getters) => {
    const ordered = state.fullResearchListing
      .map((item) => {
        const isTop = researchService.getTopResearchesIds().some((id) => id == item.research_id);
        return { ...item, isTop };
      })
      .filter((item) => !state.filter.topOnly || item.isTop)
      .filter((item) => !state.filter.q || item.title.toLowerCase().indexOf(state.filter.q.toLowerCase()) != -1)
      .filter((item) => !state.filter.disciplines.length || item.disciplines.some((discipline) => state.filter.disciplines.some((d) => d.id == discipline.id)))
      .filter((item) => !state.filter.organizations.length || state.filter.organizations.some((org) => item.group_id == org.id))
      .filter((item) => !state.filter.trl.length || state.filter.trl.some((t) => t.id === item.researchRef.trl))
      .map((item) => {
        const totalVotes = state.feedTotalVotes.filter((vote) => vote.research_id == item.research_id);
        const reviews = state.feedResearchReviews.filter((review) => review.research_id == item.research_id);
        const group = state.feedResearchGroups.find((group) => group.id == item.group_id);
        const researchMembers = state.feedResearchGroupsMembers.filter((user) => item.members.some((a) => a == user.account.name));
        const tokenSale = state.feedResearchTokenSales.find((tokenSale) => tokenSale.research_id == item.research_id);
        const tokenSaleContributions = tokenSale ? state.feedResearchTokenSalesContributions.filter((c) => c.research_token_sale_id == tokenSale.id) : [];
        const disciplines = item.disciplines.map((discipline) => ({ ...discipline }));
        return {
          ...item,
          totalVotes,
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

  organizations: (state) => state.feedResearchGroups.filter((g) => !g.is_personal),

  allCollapsed: (state, getters) => state.fullResearchListing.reduce((acc, item) => acc && item.isCollapsed, true),

  hasSelectedChildDiscipline: (state, getters) => (discipline) => state.filter.disciplines.find((d) => {
    const parts = d.path.split('.');
    return d.id != discipline.id && parts.some((p) => p == discipline.path);
  }) !== undefined
};

// actions
const actions = {

  loadResearchFeed({
    state, dispatch, commit, rootGetters
  }) {
    const { username } = rootGetters['auth/user'];
    const alldisciplinesId = 0;

    let fullResearchListing = [];
    return deipRpc.api.getAllResearchesListingAsync(0, alldisciplinesId)
      .then((listing) => {
        fullResearchListing = listing
          .filter((item) => !item.is_private)
          .map((item) => ({ ...item, isCollapsed: true }));

        const researchRefsLoad = Promise.all(fullResearchListing
          .map((r) => researchService.getResearch(r.research_id)
            .then((researchRef) => {
              r.researchRef = researchRef;
            })));

        const researchTotalVotesLoad = Promise.all(listing
          .map((r) => expertiseContributionsService.getExpertiseContributionsByResearch(r.research_id)));

        const researchReviewsLoad = Promise.all(listing
          .map((r) => deipRpc.api.getReviewsByResearchAsync(r.research_id)
            .then((reviews) => reviews.map((review) => ({ ...review, research_id: r.research_id })))));

        const researchGroupsLoad = Promise.all(listing
          .map((r) => r.group_id)
          .reduce((acc, groupId) => (acc.some((g) => g == groupId) ? acc : [groupId, ...acc]), [])
          .map((groupId) => researchGroupService.getResearchGroupById(groupId)));

        const groupsMembersLoad = usersService.getEnrichedProfiles(listing
          .map((r) => r.group_members)
          .reduce((acc, groupMembers) => {
            const unique = groupMembers.filter((name) => !acc.some((a) => a == name));
            return [...unique, ...acc];
          }, []));

        const tokenSalesLoad = Promise.all(listing
          .map((r) => investmentsService.getCurrentTokenSaleByResearchId(r.research_id)));

        return Promise.all([
          researchRefsLoad,
          researchTotalVotesLoad,
          researchReviewsLoad,
          researchGroupsLoad,
          groupsMembersLoad,
          tokenSalesLoad
        ]);
      })
      .then(([, totalVotes, researchReviews, groups, /* disciplinesStats, */ groupsMembers, tokenSales]) => {
        commit('SET_FULL_RESEARCH_LISTING', fullResearchListing);
        commit('SET_RESEARCH_FEED_TOTAL_VOTES_LIST', [].concat.apply([], totalVotes));
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
      });
  },

  toggleFeedItem({ commit, state, getters }, id) {
    const item = state.fullResearchListing.find((item) => item.research_id == id);
    commit('SET_FEED_ITEM_COLLAPSE_STATE', { item, collapsed: !item.isCollapsed });
  },

  toggleFeed({ commit, state, getters }) {
    const collapsed = !getters.allCollapsed;
    commit('SET_FEED_ITEMS_COLLAPSE_STATE', collapsed);
  },

  updateFilter({ commit, state, getters }, payload) {
    commit('UPDATE_FILTER', { key: payload.key, value: payload.value });
  }
};

// mutations
const mutations = {

  SET_FULL_RESEARCH_LISTING(state, list) {
    Vue.set(state, 'fullResearchListing', list);
  },

  SET_RESEARCH_FEED_TOTAL_VOTES_LIST(state, list) {
    Vue.set(state, 'feedTotalVotes', list);
  },

  SET_RESEARCH_FEED_REVIEWS_LIST(state, list) {
    Vue.set(state, 'feedResearchReviews', list);
  },

  SET_RESEARCH_FEED_GROUPS_LIST(state, list) {
    Vue.set(state, 'feedResearchGroups', list);
  },

  SET_RESEARCH_FEED_GROUPS_MEMBERS_LIST(state, list) {
    Vue.set(state, 'feedResearchGroupsMembers', list);
  },

  SET_RESEARCH_FEED_TOKEN_SALES_LIST(state, list) {
    Vue.set(state, 'feedResearchTokenSales', list);
  },

  SET_RESEARCH_FEED_TOKEN_SALES_CONTRIBUTIONS_LIST(state, list) {
    Vue.set(state, 'feedResearchTokenSalesContributions', list);
  },

  SET_FEED_ITEM_COLLAPSE_STATE(state, { item, collapsed }) {
    item.isCollapsed = collapsed;
  },

  SET_FEED_ITEMS_COLLAPSE_STATE(state, collapsed) {
    state.fullResearchListing.forEach((item) => {
      item.isCollapsed = collapsed;
    });
  },

  UPDATE_FILTER(state, { key, value }) {
    Vue.set(state.filter, key, value);
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
