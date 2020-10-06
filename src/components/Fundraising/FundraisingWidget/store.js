import { InvestmentsService } from '@deip/investments-service';

const investmentsService = InvestmentsService.getInstance();

const STATE = {
  tokenSale: undefined
};

const GETTERS = {
  tokenSale: (state) => state.tokenSale
};

const ACTIONS = {
  loadResearchTokenSale({ commit }, researchId) {
    return investmentsService.getCurrentTokenSaleByResearchId(researchId)
      .then((tokenSale) => {
        commit('setResearchTokenSale', tokenSale);
      }, (err) => { console.error(err); });
  }
};

const MUTATIONS = {
  setResearchTokenSale(state, tokenSale) {
    state.tokenSale = tokenSale;
  }
};

export const fundraisingWidgetStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
