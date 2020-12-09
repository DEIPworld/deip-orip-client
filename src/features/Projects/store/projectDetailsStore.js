import { ResearchService } from '@deip/research-service';
import deipRpc from '@deip/rpc-client';
import { camelizeObjectKeys } from '@/utils/helpers';

const researchService = ResearchService.getInstance();

const STATE = {
  projectDetails: {}
};

const GETTERS = {
  projectDetails: (state) => state.projectDetails
};

const ACTIONS = {
  getProjectDetails({ commit }, projectExternalId) {
    return researchService.getResearch(projectExternalId)
      .then((res) => {
        commit('storeProjectDetails', res);
      });
  }
};

const MUTATIONS = {
  storeProjectDetails(state, research) {
    state.projectDetails = camelizeObjectKeys(research);
  }
};

export const projectDetailsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
