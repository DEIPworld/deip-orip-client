import Vue from 'vue';
import deipRpc from '@deip/rpc-client';

import { UsersService } from '@deip/users-service';
import { AssetsService } from '@deip/assets-service';

const usersService = UsersService.getInstance();
const assetsService = AssetsService.getInstance();

const state = {
  researches: [],
  transfers: [],
  researchTokens: [],
  researchTokensHolders: [],
  researchGroups: [],
  assetsInfo: [],
  allGroups: []
};

// getters
const getters = {
  allGroups: (state) => state.allGroups,
  investments: (state, getters, rootState, rootGetters) => state.researches.map((research) => {
    const user = rootGetters['auth/user'];
    const myShare = state.researchTokens.find((rt) => rt.account_name == user.account.name && rt.research_id == research.id);
    const researchShares = state.researchTokens.filter((rt) => rt.research_id == research.id);
    const researchSharesHolders = state.researchTokensHolders.filter((user) => researchShares.some((rt) => rt.account_name == user.account.name));
    const group = state.researchGroups.find((group) => group.id == research.research_group_id);

    const shareHolders = researchSharesHolders.map((shareHolder) => {
      const share = researchShares.find((rt) => rt.account_name == shareHolder.account.name);
      return { ...shareHolder, share };
    });

    return {
      research, group, myShare, shareHolders
    };
  }),

  transfers: (state) => state.transfers,

  assetsInfo: (state) => state.assetsInfo
};

// actions
const actions = {
  loadWallet({ dispatch, rootGetters }) {
    const user = rootGetters['auth/user'];
    const username = user.account.name;
    return Promise.all([
      dispatch('loadResearchTokens', username),
      dispatch('loadTransfers', username),
      dispatch('loadAssetsInfo', user)
    ]);
  },

  loadResearchTokens({ state, commit }, username) {
    return deipRpc.api.getResearchTokensByAccountNameAsync(username)
      .then((myResearchTokens) => Promise.all(myResearchTokens.map((rt) => deipRpc.api.getResearchByIdAsync(rt.research_id))))
      .then((researches) => {
        commit('SET_RESEARCHES', researches);
        return Promise.all(researches.map((research) => deipRpc.api.getResearchTokensByResearchIdAsync(research.id)));
      })
      .then((result) => { // all share holders
        const researchTokens = [].concat.apply([], result);
        commit('SET_RESEARCH_TOKENS', researchTokens);

        const distinct = researchTokens.reduce((unique, share) => {
          if (unique.some((user) => share.account_name == user)) return unique;
          return [share.account_name, ...unique];
        }, []);
        return usersService.getEnrichedProfiles(distinct);
      })
      .then((researchTokensHolders) => {
        commit('SET_RESEARCH_TOKENS_HOLDERS', researchTokensHolders);
        return Promise.all(state.researches.map((research) => deipRpc.api.getResearchGroupByIdAsync(research.research_group_id)));
      })
      .then((groups) => {
        console.log(groups, 'groups')
        commit('SET_RESEARCH_GROUPS', groups);
      });
  },

  loadTransfers({ commit }, username) {
    return deipRpc.api.getAccountDeipToDeipTransfersAsync(username, -1, 30)
      .then((transfers) => {
        commit('SET_TRANSFERS', transfers.reverse());
      });
  },

  loadAssetsInfo({ commit }, user) {
    return Promise.all(user.balances.map(({ asset_id }) => assetsService.getAssetById(asset_id)))
      .then((data) => {
        const assetsInfo = data.reduce((result, item) => { result[item.id] = item; return result; }, {});
        commit('SET_ASSETS_INFO', assetsInfo);
      })
      .catch((err) => console.error(err));
  },

  loadAllGroups({ commit }, user) {
    return deipRpc.api.getResearchGroupTokensByAccountAsync(user)
      .then((data) => {
        const groupsInfo = Promise.all(
          data.map((groupToken) => deipRpc.api.getResearchGroupByIdAsync(groupToken.research_group_id))
        );

        const groupsShares = Promise.all(
          data.map((groupToken) => deipRpc.api.getResearchGroupTokensByResearchGroupAsync(groupToken.research_group_id))
        );

        return Promise.all([groupsInfo, groupsShares]);
      })
      .then(([groupsInfo, groupsShares]) => _.each(groupsInfo, (item, i) => {
        item.shares = groupsShares[i];
      }))
      .then((groups) => {
        commit('SET_ALL_RESEARCH_GROUPS', groups);
      });
  },
};

// mutations
const mutations = {
  SET_RESEARCHES(state, list) {
    state.researches = list;
  },

  SET_RESEARCH_TOKENS(state, list) {
    state.researchTokens = list;
  },

  SET_RESEARCH_TOKENS_HOLDERS(state, list) {
    state.researchTokensHolders = list;
  },

  SET_TRANSFERS(state, list) {
    state.transfers = list;
  },

  SET_RESEARCH_GROUPS(state, list) {
    state.researchGroups = list;
  },

  SET_ALL_RESEARCH_GROUPS(state, allGroups) {
    state.allGroups = allGroups;
  },

  SET_ASSETS_INFO(state, list) {
    state.assetsInfo = list;
  }
};

const namespaced = true;

export const userWalletStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
