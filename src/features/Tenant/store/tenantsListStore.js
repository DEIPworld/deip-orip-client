import { PortalService } from '@deip/portal-service';

import {
  camelizeObjectKeys,
  collectionList,
  collectionMerge,
  collectionOne,
  isArray
} from '@deip/toolbox';

const portalService = PortalService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state) => (query = {}) => collectionList(state.data, query),

  one: (state) => (portalId, query = {}) => collectionOne(state.data, {
    ...(portalId ? { id: portalId } : {}),
    ...query
  })
};

const ACTIONS = {
  fetch({ commit }) {
    return portalService.getNetworkPortals()
      .then(({ data: { items: res } }) => {
        commit('setData', res);
      });
  },

  get({ commit }, portalId) {
    return portalService.getNetworkPortal(portalId)
      .then(({ data: res }) => {
        commit('setData', res);
      });
  }
};

const MUTATIONS = {
  setData(state, payload) {
    if (!payload) return;

    const payloadData = isArray(payload)
      ? payload.map((entry) => camelizeObjectKeys(entry))
      : camelizeObjectKeys(payload)

    state.data = collectionMerge(
      state.data,
      // payloadData,
      payload,
      { key: '_id' }
    );
  }
};

export const portalsListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
