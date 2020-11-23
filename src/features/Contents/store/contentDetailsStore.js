import deipRpc from '@deip/rpc-client';

const STATE = {
  contentDetails: {}
};

const GETTERS = {
  contentDetails: (state) => state.contentDetails
};

const ACTIONS = {
  getContentDetails({ commit }, contentExternalId) {
    return deipRpc.api.getResearchContentAsync(contentExternalId)
      .then((content) => {
        commit('storeContentDetails', content);
      });
  }
};

const MUTATIONS = {
  storeContentDetails(state, payload) {
    state.data = payload;
  }
};

export const contentDetailsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
