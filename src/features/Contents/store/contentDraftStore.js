import { SearchService } from '@deip/search-service';

const searchService = SearchService.getInstance();

const STATE = {
  allReferences: []
};

const GETTERS = {
  allReferences: (state) => state.allReferences
};

const ACTIONS = {
  getAllReferences({ commit }) {
    return searchService.getAllResearchContents()
      .then((contents) => {
        commit('storeAllReferences', contents);
      });
  }
};

const MUTATIONS = {
  storeAllReferences(state, payload) {
    state.allReferences = payload;
  }
};

export const contentDraftStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
