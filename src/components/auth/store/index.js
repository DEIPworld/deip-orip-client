import _ from 'lodash';
import Vue from 'vue';
import { camelizeObjectKeys } from '@/utils/helpers';

import { AccessService } from '@deip/access-service';
import { UserService } from '@deip/user-service';
import { NotificationService } from '@deip/notification-service';
import { BookmarkService } from '@deip/bookmark-service';
import { PortalService } from '@deip/portal-service';
import { AssetsService } from '@deip/assets-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { TeamService } from '@deip/team-service';
import { GrantsService } from '@deip/grants-service';


const teamService = TeamService.getInstance();
const accessService = AccessService.getInstance();
const userService = UserService.getInstance();
const notificationService = NotificationService.getInstance();
const bookmarkService = BookmarkService.getInstance();
const portalService = PortalService.getInstance();
const assetsService = AssetsService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();
const grantsService = GrantsService.getInstance();

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
    projectBookmarks: [],
    balances: [],
    assets: []
  },
  portal: undefined,
  networkPortals: [],
  allAssets: [], // TODO: temp
  assets: [] // TODO: temp
};

// getters
const getters = {
  loaded: (state) => state.loaded,
  assets: (state) => state.assets, // TODO: temp
  allAssets: (state) => state.allAssets, // TODO: temp

  user: (state, getters) => {
    return {
      ...state.user,
      username: accessService.isLoggedIn() ? accessService.getDecodedToken().username : null,
      privKey: accessService.isLoggedIn() ? accessService.getOwnerPrivKey() : null,
      pubKey: accessService.isLoggedIn() ? accessService.getOwnerPubKey() : null
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
        _id: group._id,
        name: group.name,
        quorum_percent: group.quorum_percent,
        is_personal: group.is_personal,
        is_dao: group.is_dao,
        is_centralized: group.is_centralized,
        account: group.account,
        balances: group.account.balances.reduce((acc, b) => {
          acc[b.symbol] = b.amount;
          return acc;
        }, {})
      });
    }
    return groups;
  },

  userPersonalGroup: (state, getters) => getters.userGroups.find((g) => g._id === getters.user.username),

  userIsTeamMember: (state, getters) => (groupId) => getters.userGroups.some((group) => groupId === group.id),

  userIsTeamMemberExId: (state, getters) => (groupId) => getters.userGroups.some((group) => groupId === group._id),

  userCoworkers: (state, getters) => state.user.coworkers,

  userJoinRequests: (state, getters) => state.user.joinRequests,

  userBalances: (state) => {
    const userBalances = {};
    state.user.balances.forEach((item) => {
      const { amount, symbol } = item;
      userBalances[symbol] = amount;
    });
    return userBalances;
  },

  userAssets: (state) => state.user.assets,

  portal: (state) => state.portal,

  isUniversityCertifier: (state, getters) => state.user.profile.roles.some((r) => r.role === 'university-certifier'
    && getters.portal
    && r.teamId == getters.portal.account.name),

  isGrantProgramOfficer: (state, getters) => state.user.profile.roles.some((r) => r.role === 'grant-program-officer'
      && getters.portal
      && r.teamId == getters.portal.account.name),

  isGrantChiefOfficer: (state, getters) => state.user.profile.roles.some((r) => r.role === 'grant-chief-officer'
    && getters.portal
    && r.teamId == getters.portal.account.name),

  isGrantFinanceOfficer: (state, getters) => state.user.profile.roles.some((r) => r.role === 'grant-finance-officer'
      && getters.portal
    && r.teamId == getters.portal.account.name),

  isTreasuryCertifier: (state, getters) => state.user.profile.roles.some((r) => r.role === 'treasury-certifier'
    && getters.portal
    && r.teamId == getters.portal.account.name)
};

// actions
const actions = {

  loadUser({ commit, dispatch }) {
    return Promise.all([
      dispatch('loadUserData'),
      dispatch('loadExpertTokens'),
      dispatch('loadJoinRequests'),
      dispatch('loadProjectBookmarks'),
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
      .then(({ data: { items: allAssets } }) => {
        // commit('storeAllAssets', allAssets.map((b) => camelizeObjectKeys(b)));
        commit('storeAllAssets', allAssets);
      });
  },

  loadAssets({ commit }) { // TODO: temp
    return assetsService.getAssetsByType(1)
      .then(({ data: { items: res } }) => {
        const assets = res.filter(r => r.string_symbol != Vue.$env.ASSET_UNIT); // filter out core asset for now
        commit('storeAssets', assets);
      });
  },

  loadProjectBookmarks({ commit, getters }, { notify } = {}) {
    const { user } = getters;
    return bookmarkService.getProjectBookmarks(user.username)
      .then(({ data: { items: projectBookmarks } }) => {
        commit('SET_USER_PROJECT_BOOKMARKS', projectBookmarks.map((b) => ({
          _id: b._id,
          projectId: b.ref
        })));
      }).finally(() => {
        if (notify) notify();
      });
  },

  loadNotifications({ state, commit, getters }, { notify } = {}) {
    const { user } = getters;
    if (user && user.username) {
      return notificationService.getNotificationsByUser(user.username)
        .then(({ data: { items: notifications } }) => {
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
      .then(({ data: { items: expertTokens } }) => {
        commit('SET_USER_EXPERT_TOKENS_LIST', expertTokens);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadUserData({ state, commit, getters }, { notify } = {}) {
    const { user } = getters;
    return userService.getUser(user.username)
      .then(({ data: result }) => {
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
      .then(({ data: { items: balances } }) => {
        const currencies = balances.filter(b => !b.tokenizedProject);
        commit('SET_USER_BALANCES', currencies);
        return Promise.all(currencies.map((b) => assetsService.getAssetBySymbol(b.asset_symbol)));
      })
      .then((res) => {
        const assets = res.map(({ data }) => data)
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
      .then(({ data: { items: groups } }) => {
        commit('SET_USER_GROUPS_LIST', groups);
      });
  },

  loadJoinRequests({ state, commit, getters }, { notify } = {}) {
    // const { user } = getters;
    // teamService.getJoinRequestsByUser(user.username)
    //   .then(({ data: { items: requests } }) => {
    //     commit('SET_USER_JOIN_REQUESTS', requests);
    //   }, (err) => {
    //     console.error(err);
    //   })
    //   .finally(() => {
    //     if (notify) notify();
    //   });
  },

  loadPortal({ state, commit, getters }, { portal, notify } = {}) {
    return portalService.getPortal(portal)
      .then(({ data: portal }) => {
        commit('SET_PORTAL', portal);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadNetworkInfo({ state, commit, getters }) {
    return portalService.getNetworkPortals()
      .then(({ data: { items: network } }) => {
        commit('SET_NETWORK_PORTALS', network);
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

  SET_USER_PROJECT_BOOKMARKS(state, list) {
    state.user.projectBookmarks = list;
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

  SET_PORTAL(state, portal) {
    state.portal = portal;
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

  SET_NETWORK_PORTALS(state, payload) {
    state.networkPortals = payload;
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
