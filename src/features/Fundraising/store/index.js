import { InvestmentsService } from '@deip/investments-service';

const investmentsService = InvestmentsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {};

const ACTIONS = {
  create({ commit }, payload) {
    return investmentsService.createProjectTokenSale(...payload)
      .then((res) => res);
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


