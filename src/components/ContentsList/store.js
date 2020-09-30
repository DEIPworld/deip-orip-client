import deipRpc from '@deip/rpc-client';
import { ResearchContentService } from '@deip/research-content-service';

const researchContentService = ResearchContentService.getInstance();

const STATE = {
  list: []
};

const GETTERS = {
  list: (state) => state.list
};

const ACTIONS = {
  getContents({ commit }, researchExternalId) {
    const researchContents = [];

    return researchContentService.getResearchContentByResearch(researchExternalId)
      .then((list) => {
        researchContents.push(...list.filter((researchContent) => !researchContent.isDraft));

        return Promise.all(
          researchContents.map(
            (content) => deipRpc.api.getReviewsByResearchContentAsync(content.external_id)
          )
        );
      })
      .then((reviews) => {
        researchContents.forEach((content, index) => {
          content.reviews = reviews[index];
        });

        commit('storeContents', researchContents);
      })
      .catch((err) => { console.error(err); });
  }
};

const MUTATIONS = {
  storeContents(state, list) {
    state.list = list;
  },
};

export const contentListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
