import deipRpc from '@deip/rpc-client';
import { InvestmentsService } from '@deip/investments-service';
import { UsersService } from '@deip/users-service';

const investmentsService = InvestmentsService.getInstance();
const usersService = UsersService.getInstance();

const STATE = {
  tokenSale: undefined,
  contributionsList: [],
  transactionsHistory: []
};

const GETTERS = {
  tokenSale: (state) => state.tokenSale,
  contributionsList: (state) => state.contributionsList,
  transactionsHistory: (state) => state.transactionsHistory
};

const ACTIONS = {
  loadResearchTokenSale({ dispatch, commit }, researchId) {
    return investmentsService.getCurrentTokenSaleByResearchId(researchId)
      .then((tokenSale) => {
        commit('setResearchTokenSale', tokenSale);
        if (tokenSale) {
          // return dispatch('loadCurrentTokenSaleContributors');
        } else {
          return dispatch('loadLastResearchTokenSale', researchId);
        }
      }, (err) => { console.error(err); });
  },

  loadAllInvestors({ commit }, researchId) {
    const contributors = [];
    return deipRpc.api.getResearchTokensByResearchIdAsync(researchId)
      .then((contributions) => {
        contributors.push(...contributions);
        return usersService.getEnrichedProfiles(contributions.map((m) => m.account_name));
      })
      .then((users) => {
        for (let i = 0; i < contributors.length; i++) {
          const contributor = contributors[i];
          contributor.user = users.find((user) => contributor.account_name === user.account.name);
        }
        commit('setResearchTokenSaleContributionsList', contributors);
      });
  },
  loadTransactionsHistory({ commit }, researchId) {
    const transactions = [];
    return deipRpc.api.getContributionsHistoryByResearchAsync(
      researchId
    )
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
    return deipRpc.api.getResearchTokenSalesByResearchIdAsync(researchId)
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
  setResearchTokenSaleContributionsList(state, contributions) {
    state.contributionsList = contributions;
  },
  setTransactionsHistory(state, transactionsHistory) {
    state.transactionsHistory = transactionsHistory;
  }
};

export const fundraisingStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
