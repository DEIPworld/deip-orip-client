import { ResearchContentService } from '@deip/research-content-service';
import {
  camelizeObjectKeys
} from '@/utils/helpers';

const researchContentService = ResearchContentService.getInstance();

const STATE = {
  referencesList: []
};

const GETTERS = {
  referencesList: (state) => state.referencesList
};

const ACTIONS = {
  getReferences({ commit }) {
    return researchContentService.getPublicResearchContentListing()
      .then((contents) => {
        commit('storeReferences', contents);
      });
  }
};

const MUTATIONS = {
  storeReferences(state, payload) {
    state.referencesList = payload.map((item) => camelizeObjectKeys(item));
  }
};

export const referencesListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
