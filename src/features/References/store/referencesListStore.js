import { ProjectContentService } from '@deip/project-content-service';

import {
  camelizeObjectKeys
} from '@/utils/helpers';

const projectContentService = ProjectContentService.getInstance();

const STATE = {
  referencesList: []
};

const GETTERS = {
  referencesList: (state) => state.referencesList
};

const ACTIONS = {
  getReferences({ commit }) {
    return projectContentService.getPublicProjectContentListing()
      .then(({ data: { items: contents } }) => {
        commit('storeReferences', contents);
      });
  }
};

const MUTATIONS = {
  storeReferences(state, payload) {
    // state.referencesList = payload.map((item) => camelizeObjectKeys(item));
    state.referencesList = payload;
  }
};

export const referencesListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
