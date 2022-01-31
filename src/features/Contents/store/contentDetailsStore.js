import { camelizeObjectKeys } from '@/utils/helpers';
import { ProjectContentService } from '@deip/project-content-service';

const projectContentService = ProjectContentService.getInstance();

const STATE = {
  contentDetails: {}
};

const GETTERS = {
  contentDetails: (state) => state.contentDetails
};

const ACTIONS = {
  getContentDetails({ commit }, contentId) {
    return projectContentService.getProjectContent(contentId)
      .then(({ data: content }) => {
        commit('storeContentDetails', content);
      });
  }
};

const MUTATIONS = {
  storeContentDetails(state, payload) {
    // state.contentDetails = camelizeObjectKeys(payload);
    state.contentDetails = payload;
  }
};

export const contentDetailsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
