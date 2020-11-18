import { ResearchService } from '@deip/research-service';
import { camelizeObjectKeys } from '@/utils/helpers';

const researchService = ResearchService.getInstance();

const STATE = {
  data: {}
};

const GETTERS = {
  data: (state) => state.data
};

const ACTIONS = {
  getResearchDetails({ commit }, projectExternalId) {
    return researchService.getResearch(projectExternalId)
      .then((res) => {
        commit('storeResearchDetails', res);
      });
  }
};

const MUTATIONS = {
  storeResearchDetails(state, research) {
    state.data = camelizeObjectKeys(research);
  }
};

export const researchStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
