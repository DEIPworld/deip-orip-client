import { InvestmentOpportunityService } from '@deip/investment-opportunity-service';
import { AssetsService } from '@deip/assets-service';
import { UserService } from '@deip/user-service';
import { TeamService } from '@deip/team-service';

const teamService = TeamService.getInstance();
const investmentOpportunityService = InvestmentOpportunityService.getInstance();
const userService = UserService.getInstance();
const assetsService = AssetsService.getInstance();

const STATE = {
  tokenSale: undefined,
  securityTokenBalances: [],
  transactionsHistory: [],
  team: {}
};

const GETTERS = {
  tokenSale: (state) => state.tokenSale,
  securityTokenBalances: (state) => state.securityTokenBalances,
  transactionsHistory: (state) => state.transactionsHistory,
  team: (state) => state.team
};

const ACTIONS = {
  loadTeam({ commit }, accountId) {
    return teamService.getTeam(accountId)
      .then(({ data: team }) => {
        commit('setTeam', team);
      });
  },
  loadProjectTokenSale({ dispatch, commit }, projectId) {
    // TODO: load project token sale by id
    return investmentOpportunityService.getCurrentInvestmentOpportunityByProject(projectId)
      .then((res) => {
        const tokenSale = res ? res.data : res;
        commit('setProjectTokenSale', tokenSale);
        if (tokenSale) {
          // return dispatch('loadCurrentTokenSaleContributors');
        } else {
          return dispatch('loadLastProjectTokenSale', projectId);
        }
      }, (err) => { console.error(err); });
  },

  loadSecurityTokenHolders({ commit }, securityTokenId) {
    const securityTokenHolders = [];
    return assetsService.getAccountsAssetBalancesByAsset(securityTokenId)
      .then(({ data: { items: securityTokens } }) => {
        securityTokenHolders.push(...securityTokens);
        return userService.getUsers(securityTokens.map((m) => m.owner));
      })
      .then(({ data: { items: users } }) => {
        // TODO: Fix this for group accounts
        for (let i = 0; i < securityTokenHolders.length; i++) {
          const balance = securityTokenHolders[i];
          balance.user = users.find((user) => balance.owner === user.account.name) || {};
        }
        const securityTokenGroups = securityTokenHolders.filter(
          ({ owner }) => !users.some(({ username }) => username === owner)
        );
        return Promise.all(
          securityTokenGroups.map(({ owner }) => teamService.getTeam(owner))
        );
      })
      .then((res) => {
        const groups = res.map(({ data }) => data)
        securityTokenHolders.forEach((s) => {
          if (!s.user.account) {
            s.user = groups.find(
              (g) => g._id === s.owner
            );
          }
        });
        commit('setSecurityTokenBalancesList', securityTokenHolders);
      });
  },

  loadTransactionsHistory({ commit }, projectId) {
    // TODO: load history by specific security token
    const transactions = [];
    return investmentOpportunityService.getInvestmentsByProject(projectId)
      .then(({ data: { items: transactionsList } }) => {
        transactions.push(...transactionsList);
        return userService.getUsers(transactionsList.map((t) => t.investor));
      })
      .then(({ data: { items: users } }) => {
        for (let i = 0; i < transactions.length; i++) {
          const transaction = transactions[i];
          transaction.sender = users.find(
            (user) => transaction.investor === user.account.name
          );
        }
        commit('setTransactionsHistory', transactions);
      });
  },

  loadLastProjectTokenSale({ commit }, projectId) {
    return investmentOpportunityService.getInvestmentOpportunitiesByProject(projectId)
      .then(({ data: { items: tokenSales } }) => {
        const lastTokenSale = tokenSales.sort((a, b) => {
          const dateA = new Date(a.end_time);
          const dateB = new Date(b.end_time);
          return dateB - dateA;
        })[0];
        commit('setProjectTokenSale', lastTokenSale);
      });
  }
};

const MUTATIONS = {
  setProjectTokenSale(state, tokenSale) {
    state.tokenSale = tokenSale;
  },
  setSecurityTokenBalancesList(state, securityTokenBalances) {
    state.securityTokenBalances = securityTokenBalances;
  },
  setTransactionsHistory(state, transactionsHistory) {
    state.transactionsHistory = transactionsHistory;
  },
  setTeam(state, team) {
    state.team = team;
  }
};

export const fundraisingStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
