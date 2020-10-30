import Vue from 'vue';
import deipRpc from '@deip/rpc-client';
import moment from 'moment';

import { AssetsService } from '@deip/assets-service';
import { ResearchService } from '@deip/research-service';
import { InvestmentsService } from '@deip/investments-service';
import { BlockchainService } from '@deip/blockchain-service';
import { ResearchGroupService } from '@deip/research-group-service';

const blockchainService = BlockchainService.getInstance();
const investmentsService = InvestmentsService.getInstance();
const researchService = ResearchService.getInstance();
const assetsService = AssetsService.getInstance();
const researchGroupService = ResearchGroupService.getInstance();

const state = {
  researches: [],
  researchTokens: [],
  researchTokensHolders: [],
  researchGroups: [],
  assetsInfo: [],
  groupData: {},
  balances: [],
  investmentsRevenueHistory: [],
  allGroups: []
};

// getters
const getters = {
  allGroups: (state) => state.allGroups,

  assetsInfo: (state) => state.assetsInfo,
  balances: (state, getters, rootState, rootGetters) => state.balances.map((item) => {
    const user = rootGetters['auth/user'];
    const revenueHistoryChartData = [...item.revenueHistory];
    const myShare = item.shareHolders.find(
      (s) => s.account_name === user.account.name
    );
    return {
      ...item,
      myShare,
      revenueHistoryChartData: revenueHistoryChartData.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateA - dateB;
      }).map((i) => [moment(i.timestamp).format('DD MMM YY'), blockchainService.fromAssetsToFloat(i.revenue)])
    };
  }),
  groupData: (state) => state.groupData
};

// actions
const actions = {
  loadBalances({ state, commit }, account) {
    let balances = [];
    return investmentsService.getSecurityTokenBalancesByOwner(account)
      .then((balancesList) => {
        balances.push(...balancesList);
        return Promise.all(balances.map(
          (b) => researchService.getResearch(b.research_external_id)
        ));
      })
      .then((researches) => {
        balances = balances.map((b) => ({
          ...b,
          research: researches.find((r) => r.external_id === b.research_external_id)
        }));

        return Promise.all(
          balances.map((b) => investmentsService.getAccountRevenueHistoryBySecurityToken(
            b.research.research_group.external_id,
            b.security_token_external_id
          ))
        );
      })
      .then((history) => {
        balances = balances.map((b) => ({
          ...b,
          revenueHistory: history.find(
            (r) => r[0] && r[0].account === b.research.research_group.external_id
          ) || []
        }));

        return Promise.all(
          balances.map((b) => deipRpc.api.getResearchTokensByResearchIdAsync(
            b.research.id
          ))
        );
      })
      .then((shareHolders) => {
        balances = balances.map((b) => ({
          ...b,
          shareHolders: shareHolders.find(
            (s) => s[0] && s[0].research_external_id === b.research.research_group.external_id
          ) || []
        }));

        commit('setBalances', balances);
      })
      .catch((err) => console.error(err));
  },

  loadAssetsInfo({ commit }, account) {
    return Promise.all(account.balances.map(({ asset_id }) => assetsService.getAssetById(asset_id)))
      .then((data) => {
        const assetsInfo = data.reduce((result, item) => { result[item.id] = item; return result; }, {});
        commit('SET_ASSETS_INFO', assetsInfo);
      })
      .catch((err) => console.error(err));
  },

  loadBalanceData({ commit, dispatch }, account) {
    let groupData = {};
    return researchGroupService.getResearchGroup(account)
      .then((group) => {
        groupData = group;
        return assetsService.getAccountBalancesByOwner(groupData.external_id);
      })
      .then((balanceData) => {
        groupData.balances = balanceData;
        commit('setGroupData', groupData);
        return dispatch('loadAssetsInfo', groupData);
      })
      .catch((err) => console.error(err));
  },

  loadAllGroups({ commit }, user) {
    const groupList = [];
    return deipRpc.api.getResearchGroupTokensByAccountAsync(user)
      .then((data) => {
        const groups = data.filter((item) => !item.research_group.is_personal);
        const groupsInfo = Promise.all(
          groups.map(
            (groupToken) => deipRpc.api.getResearchGroupByIdAsync(groupToken.research_group_id)
          )
        );

        const groupsShares = Promise.all(
          groups.map(
            (groupToken) => deipRpc.api.getResearchGroupTokensByResearchGroupAsync(
              groupToken.research_group_id
            )
          )
        );

        return Promise.all([groupsInfo, groupsShares]);
      })
      .then(([groupsInfo, groupsShares]) => _.each(groupsInfo, (item, i) => {
        item.shares = groupsShares[i];
      }))
      .then((groups) => {
        groupList.push(...groups);
        return Promise.all(
          groups.map((item) => researchService.getResearchGroupResearchListing(item.external_id))
        );
      })
      .then((researches) => {
        groupList.forEach((g) => {
          const researchList = researches.filter(
            (r) => r[0] && r[0].research_group.external_id === g.external_id
          )[0];
          g.researchList = researchList;
        });
        return Promise.all(
          groupList.map(
            (item) => investmentsService.getAccountRevenueHistory(item.external_id)
          )
        );
      })
      .then((revenueHistory) => {
        groupList.forEach((g) => {
          const revenueHistoryList = revenueHistory.filter(
            (r) => r[0] && r[0].account === g.external_id
          )[0];
          g.revenueHistory = revenueHistoryList;
        });
        commit('SET_ALL_RESEARCH_GROUPS', groupList);
      })
      .catch((err) => console.error(err));
  }
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

  SET_RESEARCH_GROUPS(state, list) {
    state.researchGroups = list;
  },

  SET_ALL_RESEARCH_GROUPS(state, allGroups) {
    state.allGroups = allGroups;
  },

  SET_ASSETS_INFO(state, list) {
    state.assetsInfo = list;
  },

  setInvestmentsRevenueHistory(state, history) {
    state.investmentsRevenueHistory = history;
  },

  setBalances(state, balances) {
    state.balances = balances;
  },

  setGroupData(state, groupData) {
    state.groupData = groupData;
  }
};

const namespaced = true;

export const walletStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
