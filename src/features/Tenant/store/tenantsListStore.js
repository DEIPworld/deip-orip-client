import { TenantService } from '@deip/tenant-service';

import {
  camelizeObjectKeys,
  collectionList,
  collectionMerge,
  collectionOne,
  isArray
} from '@deip/toolbox';

const tenantService = TenantService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state) => (query = {}) => collectionList(state.data, query),

  one: (state) => (tenantId, query = {}) => collectionOne(state.data, {
    ...(tenantId ? { id: tenantId } : {}),
    ...query
  })
};

const ACTIONS = {
  fetch({ commit }) {
    return tenantService.getNetworkTenants()
      .then((res) => {
        commit('setData', res);
      });
  },

  get({ commit }, tenantId) {
    return tenantService.getNetworkTenant(tenantId)
      .then((res) => {
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
      payloadData,
      { key: 'id' }
    );
  }
};

export const tenantsListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
