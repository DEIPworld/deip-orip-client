import { ResearchService } from '@deip/research-service';
import { camelizeObjectKeys } from '@/utils/helpers';

const researchService = ResearchService.getInstance();

const STATE = {
  projectDetails: {}
};

const GETTERS = {
  projectDetails: (state) => state.projectDetails
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
    state.projectDetails = camelizeObjectKeys(research);
  }
};

export const researchStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
