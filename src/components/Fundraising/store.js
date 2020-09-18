import deipRpc from '@deip/rpc-client';
import { InvestmentsService } from '@deip/investments-service';
import { UsersService } from '@deip/users-service';

const investmentsService = InvestmentsService.getInstance();
const usersService = UsersService.getInstance();

const STATE = {
  tokenSale: undefined,
  contributionsList: []
};

const GETTERS = {
  tokenSale: (state) => state.tokenSale,
  contributionsList: (state) => state.contributionsList
};

const ACTIONS = {
  loadResearchTokenSale({ dispatch, commit }, researchId) {
    return investmentsService.getCurrentTokenSaleByResearchId(researchId)
      .then((tokenSale) => {
        commit('setResearchTokenSale', tokenSale);

        if (tokenSale) {
          return dispatch('loadTokenSaleContributors');
        }
      }, (err) => { console.error(err); });
  },

  loadTokenSaleContributors({ state, commit }) {
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
          contributor.user = users.find((user) => contributor.owner === user.account.name);
        }
        commit('setResearchTokenSaleContributionsList', contributors);
      });
  }
};

const MUTATIONS = {
  setResearchTokenSale(state, tokenSale) {
    state.tokenSale = tokenSale;
  },
  setResearchTokenSaleContributionsList(state, contributions) {
    state.contributionsList = contributions;
  }
};

export const fundraisingStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
