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
    let research;
    return researchService.getResearch(projectExternalId)
      .then((res) => {
        research = res;
        return deipRpc.api.getResearchGroupMembershipTokensAsync(research.research_group.external_id);
      })
      .then((groupMembers) => {
        commit('storeProjectDetails', {
          ...research,
          groupMembers
        });
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
