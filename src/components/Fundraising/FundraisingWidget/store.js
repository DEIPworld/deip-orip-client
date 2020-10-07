import { InvestmentsService } from '@deip/investments-service';
import { ResearchService } from '@deip/research-service';

const researchService = ResearchService.getInstance();
const investmentsService = InvestmentsService.getInstance();

const STATE = {
  tokenSale: undefined,
  research: undefined
};

const GETTERS = {
  tokenSale: (state) => state.tokenSale,
  research: (state) => state.research
};

const ACTIONS = {
  loadResearchTokenSale({ commit }, researchId) {
    return researchService.getResearch(researchId)
      .then((res) => {
        commit('setResearch', res);
        return investmentsService.getCurrentTokenSaleByResearchId(res.id)
          .then((tokenSale) => {
            commit('setResearchTokenSale', tokenSale);
          });
      }, (err) => { console.error(err); });
  }
};

const MUTATIONS = {
  setResearchTokenSale(state, tokenSale) {
    state.tokenSale = tokenSale;
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
