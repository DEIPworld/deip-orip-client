import { InvestmentsService } from '@deip/investments-service';

const investmentsService = InvestmentsService.getInstance();

const STATE = {
  tokenSale: undefined,
  tokenSales: []
};

const GETTERS = {
  tokenSale: (state) => state.tokenSale,
  project: (state) => state.project,
  hasHistory: (state) => !!state.tokenSales.length
};

const ACTIONS = {
  loadProjectTokenSale({ dispatch, commit }, projectId) {
    return investmentsService.getCurrentTokenSaleByProject(projectId)
      .then((res) => {
        const tokenSale = res ? res.data : res;
        commit('setProjectTokenSale', tokenSale);
        if (!tokenSale) {
          return dispatch('loadHistoryProjectTokenSale', projectId);
        }
      }), (err) => { console.error(err); };
  },
  loadHistoryProjectTokenSale({ commit }, projectId) {
    return investmentsService.getProjectTokenSalesByProject(projectId)
      .then(({ data: { items: tokenSales } }) => {
        commit('setHistoryProjectTokenSale', tokenSales);
      });
  }
};

const MUTATIONS = {
  setProjectTokenSale(state, tokenSale) {
    state.tokenSale = tokenSale;
  },
  setHistoryProjectTokenSale(state, tokenSales) {
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
