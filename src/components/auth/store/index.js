import _ from 'lodash';
import deipRpc from '@deip/rpc-client';
import Vue from 'vue';
import { camelizeObjectKeys } from '@/utils/helpers';

import { AccessService } from '@deip/access-service';
import { UserService } from '@deip/user-service';
import { NotificationService } from '@deip/notification-service';
import { BookmarkService } from '@deip/bookmark-service';
import { TenantService } from '@deip/tenant-service';
import { AssetsService } from '@deip/assets-service';
import { BlockchainService } from '@deip/blockchain-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { TeamService } from '@deip/team-service';

const teamService = TeamService.getInstance();
const accessService = AccessService.getInstance();
const userService = UserService.getInstance();
const notificationService = NotificationService.getInstance();
const bookmarkService = BookmarkService.getInstance();
const tenantService = TenantService.getInstance();
const assetsService = AssetsService.getInstance();
const blockchainService = BlockchainService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const state = {
  loaded: false,
  user: {
    profile: undefined,
    account: undefined,
    expertTokens: [],
    groups: [],
    coworkers: [],
    joinRequests: [],
    notifications: [],
    researchBookmarks: [],
    balances: [],
    assets: []
  },
  tenant: undefined,
  networkTenants: [],
  allAssets: [], // TODO: temp
  assets: [] // TODO: temp
};

// getters
const getters = {
  loaded: (state) => state.loaded,
  assets: (state) => state.assets, // TODO: temp
  allAssets: (state) => state.allAssets, // TODO: temp

  user: (state, getters) => {
    const privKey = accessService.isLoggedIn() ? accessService.getOwnerWif() : null;
    return {
      ...state.user,
      username: accessService.isLoggedIn() ? accessService.getDecodedToken().username : null,
      privKey,
      pubKey: accessService.isLoggedIn() ? deipRpc.auth.wifToPublic(privKey) : null
    };
  },

  userExperise: (state, getters) => {
    const experise = [];
    for (let i = 0; i < state.user.expertTokens.length; i++) {
      const exp = state.user.expertTokens[i];
      experise.push(exp);
    }
    return experise;
  },

  userGroups: (state, getters) => {
    const groups = [];
    for (let i = 0; i < state.user.groups.length; i++) {
      const group = state.user.groups[i];
      groups.push({
        id: group.id,
        external_id: group.external_id,
        name: group.name,
        quorum_percent: group.quorum_percent,
        is_personal: group.is_personal,
        is_dao: group.is_dao,
        is_centralized: group.is_centralized,
        account: group.account,
        balances: group.account.balances.reduce((acc, b) => {
          acc[b.split(' ')[1]] = blockchainService.fromAssetsToFloat(b);
          return acc;
        }, {})
      });
    }
    return groups;
  },

  userPersonalGroup: (state, getters) => getters.userGroups.find((g) => g.external_id === getters.user.username),

  userIsResearchGroupMember: (state, getters) => (groupId) => getters.userGroups.some((group) => groupId === group.id),

  userIsResearchGroupMemberExId: (state, getters) => (groupId) => getters.userGroups.some((group) => groupId === group.external_id),

  userCoworkers: (state, getters) => state.user.coworkers,

  userJoinRequests: (state, getters) => state.user.joinRequests,

  userBalances: (state) => {
    const userBalances = {};
    state.user.balances.forEach((item) => {
      const { amount } = item;
      userBalances[amount.split(' ')[1]] = amount;
    });
    return userBalances;
  },

  userAssets: (state) => state.user.assets,

  tenant: (state) => state.tenant,

  isUniversityCertifier: (state, getters) => state.user.profile.roles.some((r) => r.role === 'university-certifier'
    && getters.tenant
    && r.researchGroupExternalId == getters.tenant.account.name),

  isGrantProgramOfficer: (state, getters) => state.user.profile.roles.some((r) => r.role === 'grant-program-officer'
      && getters.tenant
      && r.researchGroupExternalId == getters.tenant.account.name),

  isGrantChiefOfficer: (state, getters) => state.user.profile.roles.some((r) => r.role === 'grant-chief-officer'
    && getters.tenant
    && r.researchGroupExternalId == getters.tenant.account.name),

  isGrantFinanceOfficer: (state, getters) => state.user.profile.roles.some((r) => r.role === 'grant-finance-officer'
      && getters.tenant
    && r.researchGroupExternalId == getters.tenant.account.name),

  isTreasuryCertifier: (state, getters) => state.user.profile.roles.some((r) => r.role === 'treasury-certifier'
    && getters.tenant
    && r.researchGroupExternalId == getters.tenant.account.name)
};

// actions
const actions = {

  loadUser({ commit, dispatch }) {
    return Promise.all([
      dispatch('loadUserData'),
      dispatch('loadExpertTokens'),
      dispatch('loadJoinRequests'),
      dispatch('loadResearchBookmarks'),
      dispatch('loadBalances'),
      dispatch('loadGroups'),
      dispatch('loadAssets'), // TODO: temp
      dispatch('loadAllAssets') // TODO: temp
    ]).then(() => {
      commit('SET_USER_LOADED', true);
    });
  },

  loadAllAssets({ commit }) { // TODO: temp
    return assetsService.lookupAssets("", 10000)
      .then((allAssets) => {
        commit('storeAllAssets', allAssets.map((b) => camelizeObjectKeys(b)));
      });
  },

  loadAssets({ commit }) { // TODO: temp
    return assetsService.getAssetsByType(1)
      .then((res) => {
        const assets = res.filter(r => r.string_symbol != Vue.$env.ASSET_UNIT); // filter out core asset for now
        commit('storeAssets', assets);
      });
  },

  loadResearchBookmarks({ commit, getters }, { notify } = {}) {
    const { user } = getters;
    return bookmarkService.getProjectBookmarks(user.username)
      .then((researchBookmarks) => {
        commit('SET_USER_RESEARCH_BOOKMARKS', researchBookmarks.map((b) => ({
          _id: b._id,
          researchId: b.ref
        })));
      }).finally(() => {
        if (notify) notify();
      });
  },

  loadNotifications({ state, commit, getters }, { notify } = {}) {
    const { user } = getters;
    if (user && user.username) {
      return notificationService.getNotificationsByUser(user.username)
        .then((notifications) => {
          commit('SET_USER_NOTIFICATION_PROPOSALS', notifications);
        })
        .finally(() => {
          if (notify) notify();
        });
    }
    if (notify) notify();
  },

  loadExpertTokens({ state, commit, getters }, { notify } = {}) {
    const { user } = getters;
    expertiseContributionsService.getAccountExpertiseTokens(user.username)
      .then((expertTokens) => {
        commit('SET_USER_EXPERT_TOKENS_LIST', expertTokens);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadUserData({ state, commit, getters }, { notify } = {}) {
    const { user } = getters;
    return userService.getUser(user.username)
      .then((result) => {
        commit('SET_USER_PROFILE', result.profile);
        commit('SET_USER_ACCOUNT', result.account);
      }, (err) => {
        console.error(err);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadBalances({ state, commit, getters }, { notify } = {}) {
    const { user } = getters;
    return assetsService.getAccountAssetsBalancesByOwner(user.username)
      .then((balances) => {
        const currencies = balances.filter(b => !b.tokenized_research);
        commit('SET_USER_BALANCES', currencies);
        return Promise.all(currencies.map((b) => assetsService.getAssetBySymbol(b.asset_symbol)));
      })
      .then((assets) => {
        commit('SET_USER_ASSETS', assets);
      })
      .catch((err) => { console.error(err); })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadGroups({ state, dispatch, commit, getters }) {
    const { user } = getters;

    return teamService.getTeamsByUser(user.username)
      .then((groups) => {
        commit('SET_USER_GROUPS_LIST', groups);
      });
  },

  loadJoinRequests({ state, commit, getters }, { notify } = {}) {
    // const { user } = getters;
    // researchGroupService.getJoinRequestsByUser(user.username)
    //   .then((requests) => {
    //     commit('SET_USER_JOIN_REQUESTS', requests);
    //   }, (err) => {
    //     console.error(err);
    //   })
    //   .finally(() => {
    //     if (notify) notify();
    //   });
  },

  loadTenant({ state, commit, getters }, { tenant, notify } = {}) {
    return tenantService.getTenant(tenant)
      .then((tenant) => {
        commit('SET_TENANT', tenant);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadNetworkInfo({ state, commit, getters }) {
    return tenantService.getNetworkTenants()
      .then((network) => {
        commit('SET_NETWORK_TENANTS', network);
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

// mutations
const mutations = {

  SET_USER_EXPERT_TOKENS_LIST(state, list) {
    state.user.expertTokens = list;
  },

  SET_USER_GROUPS_LIST(state, list) {
    state.user.groups = list;
  },

  SET_USER_RESEARCH_BOOKMARKS(state, list) {
    state.user.researchBookmarks = list;
  },

  SET_USER_NOTIFICATION_PROPOSALS(state, list) {
    state.user.notifications = list;
  },

  SET_USER_COWORKERS_LIST(state, list) {
    state.user.coworkers = list;
  },

  SET_USER_PROFILE(state, profile) {
    state.user.profile = profile;
  },

  SET_USER_JOIN_REQUESTS(state, requests) {
    state.user.joinRequests = requests;
  },

  SET_USER_ACCOUNT(state, account) {
    state.user.account = account;
  },

  SET_TENANT(state, tenant) {
    state.tenant = tenant;
  },

  SET_USER_BALANCES(state, balances) {
    state.user.balances = balances;
  },

  SET_USER_ASSETS(state, assets) {
    state.user.assets = assets;
  },

  SET_USER_LOADED(state, payload) {
    state.loaded = payload;
  },

  SET_NETWORK_TENANTS(state, payload) {
    state.networkTenants = payload;
  },

  storeAssets(state, payload) { // TODO: temp
    state.assets = payload;
  },

  storeAllAssets(state, allAssets) {
    state.allAssets = allAssets;
  }
};

const namespaced = true;

export const authStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
