import { ResearchService } from '@deip/research-service';

const researchService = ResearchService.getInstance();

const STATE = {
  data: {}
};

const GETTERS = {
  data: (state) => state.data
};

const ACTIONS = {
  getResearchDetails({ commit }, researchExternalId) {
    return researchService.getResearch(researchExternalId)
      .then((res) => {
        commit('storeResearchDetails', res);
      });
  }
};

const MUTATIONS = {
  storeResearchDetails(state, research) {
    state.data = research;
  }
};

export const researchStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
