import { arrayToTree } from "performant-array-to-tree";

import { DomainsService } from '@deip/domains-service';

import {
  camelizeObjectKeys,
  collectionList,
  collectionMerge,
  collectionOne
} from '@/utils/helpers';

const domainsService = DomainsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state) => (query = {}) => collectionList(state.data, query),
  topLevelList: (state) => (query = {}) => collectionList(state.data, { ...query, parentId: '' }),
  one: (state) => (_id, query = {}) => collectionOne(state.data, {
    ...(_id ? { _id } : {}),
    ...query
  }),
  tree: (state) => (query = {}) => {
    const array = collectionList(state.data, query);

    return arrayToTree(array, {
      id: '_id',
      parentId: 'parentId',
      dataField: null
    });
  }
};

const ACTIONS = {
  fetch({ commit }) {
    return domainsService.getAllDomains()
      .then((domains) => {
        commit('setList', domains);
      });
  }
};

const MUTATIONS = {
  setList(state, payload) {
    if (!payload) return;

    state.data = collectionMerge(
      state.data,
      payload,
      // payload.map((domain) => camelizeObjectKeys(domain)),
      { key: '_id' }
    );
  }
};

export const domainsStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
