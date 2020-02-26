import Vue from 'vue';
import deipRpc from '@deip/deip-oa-rpc-client';
import { isLoggedIn, getDecodedToken } from '@/utils/auth'
import * as usersService from '@/utils/user';
import tokenSaleService from '@/services/TokenSaleService';
import * as researchGroupService from '@/services/ResearchGroupService';
import * as researchService from '@/services/ResearchService';

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

}

// getters
const getters = {

  filter: (state, getters) => {
    return state.filter;
  },

  researchFeed: (state, getters) => {
    let ordered = state.fullResearchListing
      .map(item  => {
        let isTop = researchService.getTopResearchesIds().some(id => id == item.research_id);
        return { ...item, isTop };
      })
      .filter(item => !state.filter.topOnly || item.isTop)
      .filter(item => !state.filter.q || item.title.toLowerCase().indexOf(state.filter.q.toLowerCase()) != -1)
      .filter(item => !state.filter.disciplines.length || item.disciplines.some(discipline => state.filter.disciplines.some(d => d.id == discipline.id)))
      .filter(item => !state.filter.organizations.length || state.filter.organizations.some(org => item.group_id == org.id))
      .map(item => {
        let totalVotes = state.feedTotalVotes.filter(vote => vote.research_id == item.research_id);
        let reviews = state.feedResearchReviews.filter(review => review.research_id == item.research_id);
        let group = state.feedResearchGroups.find(group => group.id == item.group_id);
        let researchMembers = state.feedResearchGroupsMembers.filter(user => item.members.some(a => a == user.account.name));
        let tokenSale = state.feedResearchTokenSales.find(tokenSale => tokenSale.research_id == item.research_id);
        let tokenSaleContributions = tokenSale ? state.feedResearchTokenSalesContributions.filter(c => c.research_token_sale_id == tokenSale.id) : [];
        let disciplines = item.disciplines.map(discipline => {
          let stats = state.feedDisciplinesStatistics.find(stat => stat.discipline_id == discipline.id);
          return { ...discipline, stats };
        });
        return { ...item, totalVotes, reviews, group, authors: researchMembers, tokenSale, tokenSaleContributions, disciplines };
      })
      // .sort((a, b) => {
      //   if (b.created_at > a.created_at) {
      //     return 1
      //   }

      //   return -1;
      // });

    return ordered;
  },

  organizations: (state) => {
    return state.feedResearchGroups.filter((g) => !g.is_personal);
  },

  allCollapsed: (state, getters) => {
    return state.fullResearchListing.reduce((acc, item) => acc && item.isCollapsed, true);
  },

  hasSelectedChildDiscipline: (state, getters) => {
    return discipline => state.filter.disciplines.find(d => {
      const parts = d.path.split('.')
      return d.id != discipline.id && parts.some(p => p == discipline.path);
    }) !== undefined;
  }
}

// actions
const actions = {

  loadResearchFeed({ state, dispatch, commit, rootGetters }) {
    const username = rootGetters['auth/user'].username;
    const alldisciplinesId = 0;

    return deipRpc.api.getAllResearchesListingAsync(0, alldisciplinesId)
      .then(listing => {
        commit('SET_FULL_RESEARCH_LISTING', listing.filter((item) => {
          if (!item.is_private) return true;

          return username ? item.group_members.includes(username) : false;
        }).map(item => {return {...item, isCollapsed: true }}));

        let researchTotalVotesLoad = Promise.all(listing
          .map(r => deipRpc.api.getTotalVotesByResearchAsync(r.research_id)));
        
        let researchReviewsLoad = Promise.all(listing
          .map(r => deipRpc.api.getReviewsByResearchAsync(r.research_id)
            .then((reviews) => { return reviews.map(review => { return { ...review, research_id: r.research_id}})})
          ));

        let researchGroupsLoad = Promise.all(listing
          .map(r => r.group_id)
          .reduce((acc, groupId) => {
            return acc.some(g => g == groupId) ? acc : [groupId, ...acc];
          }, [])
          .map(groupId => researchGroupService.getResearchGroupById(groupId)));

        // let disciplineStatsLoad = Promise.all(listing
        //   .map(r => r.disciplines)
        //   .reduce((acc, disciplines) => {
        //     let unique = disciplines.filter(d => !acc.some(id => id == d.id));
        //     return [...unique.map(d => d.id), ...acc];
        //   }, [])
        //   .map(d => deipRpc.api.getEciAndExpertiseStatsByDisciplineIdAsync(d)
        //     .then((stats) => { return { discipline_id: d, ...stats } })
        //   ));
        
        let groupsMembersLoad = usersService.getEnrichedProfiles(listing
          .map(r => r.group_members)
          .reduce((acc, groupMembers) => {
            let unique = groupMembers.filter(name => !acc.some(a => a == name));
            return [...unique, ...acc];
          }, []));
        
        let tokenSalesLoad = Promise.all(listing
          .map(r => tokenSaleService.getCurrentTokenSaleByResearchId(r.research_id)));

        return Promise.all([
          researchTotalVotesLoad,
          researchReviewsLoad,
          researchGroupsLoad,
          // disciplineStatsLoad,
          groupsMembersLoad,
          tokenSalesLoad
        ]);
      })
      .then(([totalVotes, researchReviews, groups, /* disciplinesStats, */ groupsMembers, tokenSales]) => {
        commit('SET_RESEARCH_FEED_TOTAL_VOTES_LIST', [].concat.apply([], totalVotes));
        commit('SET_RESEARCH_FEED_REVIEWS_LIST', [].concat.apply([], researchReviews));
        commit('SET_RESEARCH_FEED_GROUPS_LIST', groups);
        // commit('SET_RESEARCH_FEED_DISCIPLINES_STATISTIC', disciplinesStats);
        commit('SET_RESEARCH_FEED_GROUPS_MEMBERS_LIST', groupsMembers);
        commit('SET_RESEARCH_FEED_TOKEN_SALES_LIST', tokenSales.filter(ts => ts != undefined));

        let tokenSalesContributionsLoad = Promise.all(state.feedResearchTokenSales
          .map(tokenSale => deipRpc.api.getResearchTokenSaleContributionsByResearchTokenSaleIdAsync(tokenSale.id)));
        
        return Promise.all([
          tokenSalesContributionsLoad
        ]);
      })
      .then((tokenSalesContributions) => {
        commit('SET_RESEARCH_FEED_TOKEN_SALES_CONTRIBUTIONS_LIST', [].concat.apply([], [].concat.apply([], tokenSalesContributions)));
      });
  },

  toggleFeedItem({ commit, state, getters }, id) {
    let item = state.fullResearchListing.find(item => { return item.research_id == id });
    commit('SET_FEED_ITEM_COLLAPSE_STATE', { item: item, collapsed: !item.isCollapsed })
  },

  toggleFeed({ commit, state, getters }) {
    let collapsed = !getters.allCollapsed;
    commit('SET_FEED_ITEMS_COLLAPSE_STATE', collapsed);
  },

  updateFilter({ commit, state, getters }, payload) {
    commit('UPDATE_FILTER', { key: payload.key, value: payload.value })
  }
}

// mutations
const mutations = {

  ['SET_FULL_RESEARCH_LISTING'](state, list) {
    Vue.set(state, 'fullResearchListing', list);
  },

  ['SET_RESEARCH_FEED_TOTAL_VOTES_LIST'](state, list) {
    Vue.set(state, 'feedTotalVotes', list);
  },
  
  ['SET_RESEARCH_FEED_REVIEWS_LIST'](state, list) {
    Vue.set(state, 'feedResearchReviews', list);
  },

  ['SET_RESEARCH_FEED_GROUPS_LIST'](state, list) {
    Vue.set(state, 'feedResearchGroups', list);
  },

  ['SET_RESEARCH_FEED_DISCIPLINES_STATISTIC'](state, list) {
    Vue.set(state, 'feedDisciplinesStatistics', list);
  },

  ['SET_RESEARCH_FEED_GROUPS_MEMBERS_LIST'](state, list) {
    Vue.set(state, 'feedResearchGroupsMembers', list);
  },
  
  ['SET_RESEARCH_FEED_TOKEN_SALES_LIST'](state, list) {
    Vue.set(state, 'feedResearchTokenSales', list);
  },

  ['SET_RESEARCH_FEED_TOKEN_SALES_CONTRIBUTIONS_LIST'](state, list) {
    Vue.set(state, 'feedResearchTokenSalesContributions', list);
  },

  ['SET_FEED_ITEM_COLLAPSE_STATE'](state, { item, collapsed }) {
    item.isCollapsed = collapsed;
  },

  ['SET_FEED_ITEMS_COLLAPSE_STATE'](state, collapsed) {
    state.fullResearchListing.forEach(item => { item.isCollapsed = collapsed });
  },

  ['UPDATE_FILTER'](state, { key, value }) {
    Vue.set(state.filter, key, value);
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