import { InvestmentsService } from '@deip/investments-service';
import { ResearchService } from '@deip/research-service';
import deipRpc from '@deip/rpc-client';

const researchService = ResearchService.getInstance();
const investmentsService = InvestmentsService.getInstance();

const STATE = {
  tokenSale: undefined,
  research: undefined,
  tokenSales: []
};

const GETTERS = {
  tokenSale: (state) => state.tokenSale,
  research: (state) => state.research,
  hasHistory: (state) => !!state.tokenSales.length
};

const ACTIONS = {
  loadResearchTokenSale({ dispatch, commit }, researchId) {
    return researchService.getResearch(researchId)
      .then((research) => {
        commit('setResearch', research);

        return investmentsService.getCurrentTokenSaleByResearch(research.external_id)
          .then((tokenSale) => {
            commit('setResearchTokenSale', tokenSale);
            if (!tokenSale) {
              return dispatch('loadHistoryResearchTokenSale', research.external_id);
            }
          });
      }, (err) => { console.error(err); });
  },
  loadHistoryResearchTokenSale({ commit }, researchId) {
    return deipRpc.api.getResearchTokenSalesByResearchAsync(researchId)
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
  },
  setResearch(state, research) {
    state.research = research;
  }
};

export const fundraisingWidgetStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
