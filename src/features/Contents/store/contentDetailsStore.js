import { camelizeObjectKeys } from '@/utils/helpers';
import { ResearchContentService } from '@deip/research-content-service';

const researchContentService = ResearchContentService.getInstance();

const STATE = {
  contentDetails: {}
};

const GETTERS = {
  contentDetails: (state) => state.contentDetails
};

const ACTIONS = {
  getContentDetails({ commit }, contentExternalId) {
    return researchContentService.getResearchContent(contentExternalId)
      .then((content) => {
        commit('storeContentDetails', content);
      });
  }
};

const MUTATIONS = {
  storeContentDetails(state, payload) {
    state.contentDetails = camelizeObjectKeys(payload);
  }
};

export const contentDetailsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
