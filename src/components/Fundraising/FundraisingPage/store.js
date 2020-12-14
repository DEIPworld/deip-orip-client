import deipRpc from '@deip/rpc-client';
import { InvestmentsService } from '@deip/investments-service';
import { AssetsService } from '@deip/assets-service';
import { UsersService } from '@deip/users-service';
import { ResearchService } from '@deip/research-service';
import { ResearchGroupService } from '@deip/research-group-service';

const researchGroupService = ResearchGroupService.getInstance();
const investmentsService = InvestmentsService.getInstance();
const usersService = UsersService.getInstance();
const researchService = ResearchService.getInstance();
const assetsService = AssetsService.getInstance();

const STATE = {
  tokenSale: undefined,
  securityTokenBalances: [],
  transactionsHistory: [],
  researchGroup: {}
};

const GETTERS = {
  tokenSale: (state) => state.tokenSale,
  securityTokenBalances: (state) => state.securityTokenBalances,
  transactionsHistory: (state) => state.transactionsHistory,
  researchGroup: (state) => state.researchGroup
};

const ACTIONS = {
  loadResearchGroup({ commit }, accountExternalId) {
    return researchGroupService.getResearchGroup(accountExternalId)
      .then((researchGroup) => {
        commit('setResearchGroup', researchGroup);
      });
  },
  loadResearchTokenSale({ dispatch, commit }, researchId) {
    // TODO: load research token sale by id
    return investmentsService.getCurrentTokenSaleByResearch(researchId)
      .then((tokenSale) => {
        commit('setResearchTokenSale', tokenSale);
        if (tokenSale) {
          // return dispatch('loadCurrentTokenSaleContributors');
        } else {
          return dispatch('loadLastResearchTokenSale', researchId);
        }
      }, (err) => { console.error(err); });
  },

  loadSecurityTokenHolders({ commit }, securityTokenId) {
    const securityTokenHolders = [];
    return assetsService.getAccountsAssetBalancesByAsset(securityTokenId)
      .then((securityTokens) => {
        securityTokenHolders.push(...securityTokens);
        return usersService.getEnrichedProfiles(securityTokens.map((m) => m.owner));
      })
      .then((users) => {
        // TODO: Fix this for group accounts
        for (let i = 0; i < securityTokenHolders.length; i++) {
          const balance = securityTokenHolders[i];
          balance.user = users.find((user) => balance.owner === user.account.name);
        }
        const groups = users.filter((a) => a.account.is_research_group);
        return Promise.all(
          groups.map(({ account }) => researchGroupService.getResearchGroup(account.name))
        );
      })
      .then((groups) => {
        securityTokenHolders.forEach((s) => {
          if (s.user.account.is_research_group) {
            s.user.account = groups.find(
              (g) => g.external_id === s.owner
            );
          }
        });
        commit('setSecurityTokenBalancesList', securityTokenHolders);
      });
  },

  loadTransactionsHistory({ commit }, researchId) {
    // TODO: load history by specific security token
    const transactions = [];
    return researchService.getResearch(researchId)
      .then((research) => {
        return deipRpc.api.getContributionsHistoryByResearchAsync(research.id)
      })
      .then((transactionsList) => {
        transactions.push(...transactionsList);
        return usersService.getEnrichedProfiles(transactionsList.map((t) => t.op[1].contributor));
      })
      .then((users) => {
        for (let i = 0; i < transactions.length; i++) {
          const transaction = transactions[i];
          transaction.sender = users.find(
            (user) => transaction.op[1].contributor === user.account.name
          );
        }
        commit('setTransactionsHistory', transactions);
      });
  },
  loadLastResearchTokenSale({ commit }, researchId) {
    return deipRpc.api.getResearchTokenSalesByResearchAsync(researchId)
      .then((tokenSales) => {
        const lastTokenSale = tokenSales.sort((a, b) => {
          const dateA = new Date(a.end_time);
          const dateB = new Date(b.end_time);
          return dateB - dateA;
        })[0];
        commit('setResearchTokenSale', lastTokenSale);
      });
  }
};

const MUTATIONS = {
  setResearchTokenSale(state, tokenSale) {
    state.tokenSale = tokenSale;
  },
  setSecurityTokenBalancesList(state, securityTokenBalances) {
    state.securityTokenBalances = securityTokenBalances;
  },
  setTransactionsHistory(state, transactionsHistory) {
    state.transactionsHistory = transactionsHistory;
  },
  setResearchGroup(state, researchGroup) {
    state.researchGroup = researchGroup;
  }
};

export const fundraisingStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
