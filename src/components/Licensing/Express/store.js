import where from 'filter-where';

import { ExpressLicensingService } from '@deip/express-licensing-service';

const expressLicensingService = ExpressLicensingService.getInstance();

const STATE = {
  licensesList: []
};

const GETTERS = {
  licensesList: (state) => state.licensesList,

  licensesListByUser: (state) => (projectId) => state.licensesList
    .filter(where({ researchExternalId: projectId }))
};

const ACTIONS = {
  getLicensesByProject({ commit }, projectId) {
    return expressLicensingService
      .getExpressLicensingRequestsByResearch(projectId)
      .then((result) => {
        commit('storeLicensesData', result);
      });
  },

  getLicensesByUser({ commit }, userName) {
    return expressLicensingService
      .getExpressLicensingRequestsByRequester(userName)
      .then((result) => {
        commit('storeLicensesData', result);
      });
  },

  // createLicenseRequest({ commit }, payload) {
  //
  // }
};

const MUTATIONS = {
  storeLicensesData(state, payload) {
    state.licensesList = payload;
  }
};

export const expressLicensingStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
