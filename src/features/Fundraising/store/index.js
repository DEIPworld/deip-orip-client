import { InvestmentOpportunityService } from '@deip/investment-opportunity-service';

const investmentOpportunityService = InvestmentOpportunityService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {};

const ACTIONS = {
  create({ commit }, payload) {
    return investmentOpportunityService.createInvestmentOpportunity(...payload)
      .then(({ data: res }) => res);
  }
};

const MUTATIONS = {};

export const fundraisingStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};


