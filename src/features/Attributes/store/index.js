import { AttributesService } from '@deip/attributes-service';

import {
  collectionList,
  collectionMerge,
  collectionOne
} from '@/utils/helpers';

const attributesService = AttributesService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state) => (query = {}) => collectionList(state.data, query),
  one: (state) => (attrId, query = {}) => collectionOne(state.data, {
    ...(attrId ? { _id: attrId } : {}),
    ...query
  })
};

const ACTIONS = {
  fetch({ commit }) {
    return attributesService.getNetworkAttributes()
      .then(({ data: { items: attrs } }) => {
        commit('setList', attrs);
      });
  }
};

const MUTATIONS = {
  setList(state, payload) {
    if (!payload) return;

    state.data = collectionMerge(
      state.data,
      payload,
      { key: '_id' }
    );
  }
};

export const attributesStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
