import Vue from 'vue';
import deipRpc from '@deip/deip-oa-rpc-client';
import * as usersService from '@/utils/user';
import tokenSaleService from '@/services/TokenSaleService';
import * as researchService from '@/services/ResearchService';
import * as researchGroupService from '@/services/ResearchGroupService';
import activityLogHttp from '@/services/http/activityLog';
import contentAccessRequestsHttp from '@/services/http/contentAccessRequests';

const state = {
  isLoadingDashboardPage: false,

  myMembershipResearches: [],
  myMembershipResearchesOngoingTokenSales: [],
  myMembershipResearchesOngoingTokenSalesContributions: [],

  bookmarkedResearches: [],
  bookmarkedResearchesOngoingTokenSales: [],
  bookmarkedResearchesOngoingTokenSalesContributions: [],

  researchGroups: [],
  researchGroupsTokens: [],
  researchGroupsMembers: [],

  activityLogsByGroups: [],
  unlockRequests: [],
}

// getters
const getters = {
  isLoadingDashboardPage: state => state.isLoadingDashboardPage,

  researches: (state) => {

    let unique = [
      ...state.myMembershipResearches,
      ...state.bookmarkedResearches
    ]
      .reduce((acc, research) => {
        if (acc.some(a => a.research.id == research.id)) return acc;

        let researchMembers = state.researchGroupsMembers
          .filter(member => research.members.some(name => name == member.account.name));

        let tokenSale = [
          ...state.myMembershipResearchesOngoingTokenSales,
          ...state.bookmarkedResearchesOngoingTokenSales
        ]
          .find(s => s.research_id == research.id);

        let group = state.researchGroups.find(rg => rg.id === research.research_group_id);
        let isTop = researchService.getTopResearchesIds().some(id => id == research.id);

        if (tokenSale) {
          let tokenSaleContributions = [
            ...state.myMembershipResearchesOngoingTokenSalesContributions,
            ...state.bookmarkedResearchesOngoingTokenSalesContributions
          ]
            .reduce((acc, tokenSale) => {
              if (acc.some(ts => ts.id.id == tokenSale.id)) return acc;
              return [tokenSale, ...acc];
            }, [])
            .filter(c => c.research_token_sale_id == tokenSale.id);

          return [...acc, { research: { ...research, isTop }, authors: researchMembers, tokenSale, tokenSaleContributions, group }];
        } else {
          return [...acc, { research: { ...research, isTop }, authors: researchMembers, group }];
        }
      }, []);

    unique.sort((a, b) => (a.research.title > b.research.title) ? 1 : ((b.research.title > a.research.title) ? -1 : 0));
    return unique;
  },

  activityLogsByGroups: (state) => {
    return state.activityLogsByGroups;
  },

  unlockRequests: (state) => {
    return state.unlockRequests;
  }
}

// actions
const actions = {
  loadDashboardPage({ commit, dispatch, state, rootGetters }, { username }) {
    commit('SET_DASHBOARD_PAGE_LOADING_STATE', true);
    const membershipResearchesLoad = new Promise((resolve, reject) => {
      dispatch('loadMembershipResearches', { username: username, notify: resolve });
    });
    const activityLogsLoad = new Promise((resolve, reject) => {
      let tenant = rootGetters['auth/tenant'];
      dispatch('loadActivityLogsEntries', { researchGroupsIds: tenant.researchGroupsIds, notify: resolve });
    });
    const unlockRequestsLoad = new Promise((resolve, reject) => {
      dispatch('loadUnlockRequests', { notify: resolve });
    });

    return Promise.all([
      membershipResearchesLoad,
      activityLogsLoad,
      unlockRequestsLoad
    ])
      .then(() => {
        let pulled = [
          ...state.myMembershipResearches
        ].map(research => research.id);

        const bookmarkedResearchesLoad = new Promise((resolve, reject) => {
          dispatch('loadBookmarkedResearches', { username: username, excludeIds: pulled, notify: resolve });
        });
        return Promise.all([
          bookmarkedResearchesLoad
        ]);
      })
      .then(() => {
        const researchGroupsIds = [
          ...state.myMembershipResearches,
          ...state.bookmarkedResearches
        ].reduce((unique, research) => {
          if (unique.some(rgId => rgId == research.research_group_id)) return unique;
          return [research.research_group_id, ...unique];
        }, []);

        const rgtLoad = researchGroupsIds.map(rgId => deipRpc.api.getResearchGroupTokensByResearchGroupAsync(rgId));
        const rgLoad = researchGroupsIds.map(rgId => researchGroupService.getResearchGroupById(rgId));

        return Promise.all([
          Promise.all(rgtLoad),
          Promise.all(rgLoad)
        ]);
      })
      .then(([researchGroupsTokens, researchGroups]) => {
        const tokens = [].concat.apply([], researchGroupsTokens);
        commit('SET_RESEARCH_GROUPS_TOKENS', tokens);
        commit('SET_RESEARCH_GROUPS', researchGroups);
        return usersService.getEnrichedProfiles(tokens.reduce((unique, rt) => {
          if (unique.some(name => name == rt.owner)) return unique;
          return [rt.owner, ...unique];
        }, []));
      })
      .then((researchGroupsMembers) => {
        commit('SET_RESEARCH_GROUPS_MEMBERS', researchGroupsMembers);
      })
      .finally(() => {
        commit('SET_DASHBOARD_PAGE_LOADING_STATE', false);
      })
  },

  loadMembershipResearches({ commit }, { username, notify } = {}) {
    return deipRpc.api.getResearchGroupTokensByAccountAsync(username)
      .then(list => {
        return Promise.all(list.map(rgt => deipRpc.api.getResearchesByResearchGroupIdAsync(rgt.research_group_id)));
      })
      .then((items) => {
        const researches = [].concat.apply([], items);
        commit('SET_MY_MEMBERSHIP_RESEARCHES', researches);
        return Promise.all(researches.map(research => tokenSaleService.getCurrentTokenSaleByResearchId(research.id)));
      })
      .then((response) => {
        let sales = response.filter(ts => ts != undefined)
        commit('SET_MY_MEMBERSHIP_RESEARCHES_ONGOING_TOKEN_SALES', sales);
        return Promise.all(sales.map(ts => deipRpc.api.getResearchTokenSaleContributionsByResearchTokenSaleIdAsync(ts.id)));
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
    const ids = user.researchBookmarks.map((b) => b.researchId).filter(id => !excludeIds.some(rId => rId == id));
    return Promise.all(ids.map(id => deipRpc.api.getResearchByIdAsync(id)))
      .then((researches) => {
        commit('SET_BOOKMARKED_RESEARCHES', researches);
        return Promise.all(researches.map(research => tokenSaleService.getCurrentTokenSaleByResearchId(research.id)));
      })
      .then((response) => {
        let sales = response.filter(ts => ts != undefined)
        commit('SET_BOOKMARKED_RESEARCHES_ONGOING_TOKEN_SALES', sales);
        return Promise.all(sales.map(ts => deipRpc.api.getResearchTokenSaleContributionsByResearchTokenSaleIdAsync(ts.id)));
      })
      .then((response) => {
        const contributions = [].concat.apply([], response);
        commit('SET_BOOKMARKED_RESEARCHES_ONGOING_TOKEN_SALES_CONTRIBUTIONS', contributions);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadActivityLogsEntries({ commit }, { researchGroupsIds, notify } = { researchGroupsIds: [] }) {
    let groups = [];
    return Promise.all(researchGroupsIds.map(rgId => researchGroupService.getResearchGroupById(rgId)))
      .then((items) => {
        groups.push(...items);
        return Promise.all(researchGroupsIds.map(rgId => activityLogHttp.getActivityLogsEntriesByResearchGroup(rgId)))
      })
      .then((activityLogsByGroups) => {
        let entriesByGroups = researchGroupsIds.map((rgId, i) => {
          return { researchGroup: groups[i], entries: activityLogsByGroups[i] };
        });
        commit('SET_ACTIVITY_LOG_ENTRIES', entriesByGroups);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadUnlockRequests({ commit }, { notify }) {
    let requests = [];
    return contentAccessRequestsHttp.getResearchContentAccessRequests()
      .then((items) => {
        requests.push(...items);
        commit('SET_UNLOCK_REQUESTS', requests);
      })
      .finally(() => {
        if (notify) notify();
      });
  }

}

// mutations
const mutations = {
  ['SET_DASHBOARD_PAGE_LOADING_STATE'](state, value) {
    state.isLoadingDashboardPage = value;
  },

  ['SET_MY_MEMBERSHIP_RESEARCHES'](state, list) {
    Vue.set(state, 'myMembershipResearches', list);
  },

  ['SET_MY_MEMBERSHIP_RESEARCHES_ONGOING_TOKEN_SALES'](state, list) {
    Vue.set(state, 'myMembershipResearchesOngoingTokenSales', list);
  },

  ['SET_MY_MEMBERSHIP_RESEARCHES_ONGOING_TOKEN_SALES_CONTRIBUTIONS'](state, list) {
    Vue.set(state, 'myMembershipResearchesOngoingTokenSalesContributions', list);
  },

  ['SET_RESEARCH_GROUPS_TOKENS'](state, list) {
    Vue.set(state, 'researchGroupsTokens', list);
  },

  ['SET_RESEARCH_GROUPS'](state, list) {
    Vue.set(state, 'researchGroups', list);
  },

  ['SET_RESEARCH_GROUPS_MEMBERS'](state, list) {
    Vue.set(state, 'researchGroupsMembers', list);
  },

  ['SET_BOOKMARKED_RESEARCHES'](state, list) {
    Vue.set(state, 'bookmarkedResearches', list);
  },

  ['SET_BOOKMARKED_RESEARCHES_ONGOING_TOKEN_SALES'](state, list) {
    Vue.set(state, 'bookmarkedResearchesOngoingTokenSales', list);
  },

  ['SET_BOOKMARKED_RESEARCHES_ONGOING_TOKEN_SALES_CONTRIBUTIONS'](state, list) {
    Vue.set(state, 'bookmarkedResearchesOngoingTokenSalesContributions', list);
  },

  ['SET_ACTIVITY_LOG_ENTRIES'](state, map) {
    Vue.set(state, 'activityLogsByGroups', map);
  },

  ['SET_UNLOCK_REQUESTS'](state, map) {
    Vue.set(state, 'unlockRequests', map);
  },
}

const namespaced = true;

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
