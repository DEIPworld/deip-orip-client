import deipRpc from '@deip/rpc-client';
import { InvestmentsService } from '@deip/investments-service';
import { UsersService } from '@deip/users-service';

const investmentsService = InvestmentsService.getInstance();
const usersService = UsersService.getInstance();

const STATE = {
  tokenSale: undefined,
  contributionsList: [],
  currentContributionsList: []
};

const GETTERS = {
  tokenSale: (state) => state.tokenSale,
  contributionsList: (state) => state.contributionsList,
  currentContributionsList: (state) => state.currentContributionsList
};

const ACTIONS = {
  loadResearchTokenSale({ dispatch, commit }, researchId) {
    return investmentsService.getCurrentTokenSaleByResearchId(researchId)
      .then((tokenSale) => {
        commit('setResearchTokenSale', tokenSale);
        if (tokenSale) {
          return dispatch('loadCurrentTokenSaleContributors');
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

        return Promise.all(
          contributors.map(
            (item) => deipRpc.api.getContributionsHistoryByContributorAndResearchAsync(
              item.account_name, researchId
            )
          )
        );
      })
      .then((res) => {
        for (let i = 0; i < contributors.length; i++) {
          const contributor = contributors[i];
          contributor.contributionsHistory = res.find(
            (operation) => contributor.account_name === operation[0].op[1].contributor
          );
        }
        commit('setResearchTokenSaleContributionsList', contributors)
      });
  },
  loadCurrentTokenSaleContributors({ state, commit }) {
    const contributors = [];
    return deipRpc.api.getResearchTokenSaleContributionsByResearchTokenSaleIdAsync(
      state.tokenSale.id
    )
      .then((contributions) => {
        contributors.push(...contributions);
        return usersService.getEnrichedProfiles(contributions.map((m) => m.owner));
      })
      .then((users) => {
        for (let i = 0; i < contributors.length; i++) {
          const contributor = contributors[i];
          contributor.user = users.find((user) => contributor.owner == user.account.name);
        }
        commit('setCurrentContributionsList', contributors);
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
  setCurrentContributionsList(state, currentContributionsList) {
    state.currentContributionsList = currentContributionsList;
  }
};

export const fundraisingStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
