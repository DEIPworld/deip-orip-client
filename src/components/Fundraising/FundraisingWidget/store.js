import { InvestmentsService } from '@deip/investments-service';

const investmentsService = InvestmentsService.getInstance();

const STATE = {
  tokenSale: undefined,
  tokenSales: []
};

const GETTERS = {
  tokenSale: (state) => state.tokenSale,
  research: (state) => state.research,
  hasHistory: (state) => !!state.tokenSales.length
};

const ACTIONS = {
  loadResearchTokenSale({ dispatch, commit }, researchId) {
    return investmentsService.getCurrentTokenSaleByProject(researchId)
      .then((tokenSale) => {
        commit('setResearchTokenSale', tokenSale);
        if (!tokenSale) {
          return dispatch('loadHistoryResearchTokenSale', researchId);
        }
      }), (err) => { console.error(err); };
  },
  loadHistoryResearchTokenSale({ commit }, researchId) {
    return investmentsService.getProjectTokenSalesByProject(researchId)
      .then((tokenSales) => {
        commit('setHistoryResearchTokenSale', tokenSales);
      });
  }
};

const MUTATIONS = {
  setResearchTokenSale(state, tokenSale) {
    state.tokenSale = tokenSale;
  },
  setHistoryResearchTokenSale(state, tokenSales) {
    state.tokenSales = tokenSales;
  }
};

export const fundraisingWidgetStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
