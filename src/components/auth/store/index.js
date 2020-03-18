import _ from 'lodash';
import deipRpc from '@deip/rpc-client';
import Vue from 'vue';

import { AccessService } from '@deip/access-service';
import { UsersService } from '@deip/users-service';
import { UserService } from '@deip/user-service';
import { ResearchGroupService } from '@deip/research-group-service';
import { TenantService } from '@deip/tenant-service';
import { AssetsService } from '@deip/assets-service';

const accessService = AccessService.getInstance();
const usersService = UsersService.getInstance();
const userService = UserService.getInstance();
const researchGroupService = ResearchGroupService.getInstance();
const tenantService = TenantService.getInstance();
const assetsService = AssetsService.getInstance();

const state = {
  user: {
    profile: null,
    account: null,
    expertTokens: [],
    groupTokens: [],
    groups: [],
    coworkers: [],
    joinRequests: [],
    notifications: [],
    researchBookmarks: [],
    balances: []
  },
  tenant: null
};

// getters
const getters = {
  user: (state, getters) => {
    const privKey = accessService.isLoggedIn() ? accessService.getOwnerWif() : null;
    return {
      ...state.user,
      username: accessService.isLoggedIn() ? accessService.getDecodedToken().username : null,
      privKey,
      pubKey: accessService.isLoggedIn() ? deipRpc.auth.wifToPublic(privKey) : null,
    }
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
    for (let i = 0; i < state.user.groupTokens.length; i++) {
      const rgt = state.user.groupTokens[i];
      const group = state.user.groups.find(g => g.id === rgt.research_group_id)
      groups.push({
        id: group.id,
        permlink: group.permlink,
        name: group.name,
        quorum_percent: group.quorum_percent,
        weight: rgt.amount,
        rgtId: rgt.id,
        is_personal: group.is_personal,
        is_dao: group.is_dao,
        is_centralized: group.is_centralized
      });
    }
    return groups;
  },

  userPersonalGroup: (state, getters) => {
    return getters.userGroups.find(g => g.permlink === getters.user.username);
  },

  userIsResearchGroupMember: (state, getters) => {
    return groupId => getters.userGroups.find(group => {
      return groupId === group.id
    }) !== undefined;
  },

  userCoworkers: (state, getters) => {
    return state.user.coworkers;
  },

  userJoinRequests: (state, getters) => {
    return state.user.joinRequests;
  },

  isGrantor: (state, getters) => {
    if (state.user.profile) {
      const sub = window.env.TENANT;
      return state.user.profile.agencies.some(
        a => a.name.toLowerCase() === sub.toLowerCase() && a.role === 'grantor'
      );
    }
    return false;
  },

  isOfficer: (state, getters) => {
    if (state.user.profile) {
      const sub = window.env.TENANT;
      return state.user.profile.agencies.some(
        a => a.name.toLowerCase() === sub.toLowerCase() && a.role === 'officer'
      );
    }
    return false;
  },

  userBalances: (state) => {
    let userBalances = {};
    state.user.balances.forEach(({amount}) => {
      userBalances[amount.split(' ')[1]] = amount
    })
    return userBalances
  },

  isApplicant: (state, getters) => {
    return !getters.isGrantor && !getters.isOfficer;
  },

  tenant: (state) => {
    return state.tenant;
  }
}

// actions
const actions = {

  loadUser({ state, dispatch }) {
    const profileLoad = new Promise((resolve, reject) => {
      dispatch('loadProfile', { notify: resolve })
    });
    const accountLoad = new Promise((resolve, reject) => {
      dispatch('loadAccount', { notify: resolve })
    });
    const groupsLoad = new Promise((resolve, reject) => {
      dispatch('loadGroups', { notify: resolve })
    });
    const expLoad = new Promise((resolve, reject) => {
      dispatch('loadExpertTokens', { notify: resolve })
    });
    const joinRequestLoad = new Promise((resolve, reject) => {
      dispatch('loadJoinRequests', { notify: resolve })
    });
    const researchBookmarksLoad = new Promise((resolve, reject) => {
      dispatch('loadResearchBookmarks', { notify: resolve })
    });
    const balancesLoad = new Promise((resolve, reject) => {
      dispatch('loadBalances', {notify: resolve})
    })

    return Promise.all([ profileLoad, accountLoad, groupsLoad, expLoad, joinRequestLoad, researchBookmarksLoad, balancesLoad ])
  },

  loadResearchBookmarks({ commit, getters }, { notify } = {}) {
    const user = getters.user;
    return userService.getResearchBookmarks(user.username)
      .then((researchBookmarks) => {
        commit('SET_USER_RESEARCH_BOOKMARKS', researchBookmarks.map(b => ({
          _id: b._id,
          researchId: +b.ref,
        })));
      }).finally(() => {
        if (notify) notify();
      })
  },

  loadNotifications({ state, commit, getters }, { notify } = {}) {
    const user = getters.user;
    if (user && user.username) {
      return userService.getNotificationsByUser(user.username)
        .then((notifications) => {
          commit('SET_USER_NOTIFICATION_PROPOSALS', notifications);
        })
        .finally(() => {
          if (notify) notify();
        });
    } else {
      if (notify) notify();
    }
  },

  loadExpertTokens({ state, commit, getters }, { notify } = {}) {
    const user = getters.user;

    deipRpc.api.getExpertTokensByAccountNameAsync(user.username)
      .then((expertTokens) => {
        commit('SET_USER_EXPERT_TOKENS_LIST', expertTokens)
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadProfile({ state, commit, getters }, { notify } = {}) {
    const user = getters.user;
    return usersService.getUserProfile(user.username)
      .then((profile) => {
        commit('SET_USER_PROFILE', profile)
      }, (err) => {
        console.log(err);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadBalances({ state, commit, getters }, { notify } = {}){
    const user = getters.user;
    return assetsService.getAccountBalancesByOwner(user.username)
    .then((balances) => {
      commit('SET_BALANCES', balances);
    }, (err) => {
      console.log(err);
    })
    .finally(() => {
      if (notify) notify();
    })
  },

  loadAccount({ state, commit, getters }, { notify } = {}) {
    const user = getters.user;
    return deipRpc.api.getAccountsAsync([ user.username ])
      .then((account) => {
        commit('SET_USER_ACCOUNT', account[0])
      }, (err) => {
        console.log(err)
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadGroups({ state, dispatch, commit, getters }, { notify } = {}) {
    const user = getters.user;
    const groupTokens = [];
    return deipRpc.api.getResearchGroupTokensByAccountAsync(user.username)
      .then((tokensList) => {
        const promises = [];
        for (var i = 0; i < tokensList.length; i++) {
          const rgt = tokensList[i];
          groupTokens.push(rgt);
          promises.push(deipRpc.api.getResearchGroupByIdAsync(rgt.research_group_id))
        }
        return Promise.all(promises);
      })
      .then((groups) => {
        commit('SET_USER_GROUPS_LIST', groups)
        commit('SET_USER_RESEARCH_GROUP_TOKENS_LIST', groupTokens)
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadCoworkers({ state, commit, getters }, { notify, groupId } = {}) {
    const groups = getters.userGroups;
    const coworkers = [];

    if (groups.length) {

      var promises = [];
      for (var i = 0; i < groups.length; i++) {
        const group = groups[i];
        promises.push(deipRpc.api.getResearchGroupTokensByResearchGroupAsync(group.id))
      }

      Promise.all(promises)
        .then((tokensList) => {

          const flattened = tokensList.reduce(
            function (accumulator, currentValue) {
              return accumulator.concat(currentValue);
            }, []);

          for (var i = 0; i < flattened.length; i++) {
            const rgt = flattened[i]
            if (rgt.owner !== state.user.username && coworkers.find(c => c.owner === rgt.owner) === undefined) {
              coworkers.push({ rgt: rgt });
            }
          }

          return usersService.getEnrichedProfiles(coworkers.map(c => c.rgt.owner))

        })
        .then((users) => {
          coworkers.forEach((coworker, idx) => {
            const user = users.find(u => u.account.name === coworker.rgt.owner);
            coworker.account = user.account;
            coworker.profile = user.profile;
          })
          commit('SET_USER_COWORKERS_LIST', coworkers)
        })
        .finally(() => {
          if (notify) notify();
        });
    } else {
      if (notify) notify();
    }
  },

  loadJoinRequests({ state, commit, getters }, { notify } = {}) {
    const user = getters.user;
    researchGroupService.getJoinRequestsByUser(user.username)
      .then((requests) => {
        commit('SET_USER_JOIN_REQUESTS', requests)
      }, (err) => {
        console.log(err)
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadTenant({ state, commit, getters }, { tenant, notify } = {}) {
    return tenantService.getTenantProfile(tenant)
      .then((tenantProfile) => {
        commit('SET_TENANT_PROFILE', tenantProfile);
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        if (notify) notify();
      });
  }
}

// mutations
const mutations = {

  ['SET_USER_EXPERT_TOKENS_LIST'](state, list) {
    Vue.set(state.user, 'expertTokens', list)
  },

  ['SET_USER_GROUPS_LIST'](state, list) {
    Vue.set(state.user, 'groups', list)
  },

  ['SET_USER_RESEARCH_GROUP_TOKENS_LIST'](state, list) {
    Vue.set(state.user, 'groupTokens', list)
  },

  ['SET_USER_RESEARCH_BOOKMARKS'](state, list) {
    Vue.set(state.user, 'researchBookmarks', list)
  },

  ['SET_USER_NOTIFICATION_PROPOSALS'](state, list) {
    Vue.set(state.user, 'notifications', list)
  },

  ['SET_USER_COWORKERS_LIST'](state, list) {
    Vue.set(state.user, 'coworkers', list)
  },

  ['SET_USER_PROFILE'](state, profile) {
    Vue.set(state.user, 'profile', profile)
  },

  ['SET_USER_JOIN_REQUESTS'](state, requests) {
    Vue.set(state.user, 'joinRequests', requests)
  },

  ['SET_USER_ACCOUNT'](state, account) {
    Vue.set(state.user, 'account', account)
  },

  ['SET_TENANT_PROFILE'](state, tenant) {
    Vue.set(state, 'tenant', tenant)
  },

  ['SET_BALANCES'](state, balances){
    Vue.set(state.user, 'balances', balances);
  }
}

const namespaced = true;


export const authStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
