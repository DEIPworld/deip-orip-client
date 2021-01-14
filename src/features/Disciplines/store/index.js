import { DisciplinesService } from '@deip/disciplines-service';
import {
  camelizeObjectKeys,
  collectionList,
  collectionMerge,
  collectionOne
} from '@/utils/helpers';

const disciplinesService = DisciplinesService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state) => (query = {}) => collectionList(state.data, query),
  topLevelList: (state) => (query = {}) => collectionList(state.data, { ...query, parentExternalId: '' }),
  one: (state) => (externalId, query = {}) => collectionOne(state.data, {
    ...(externalId ? { externalId } : {}),
    ...query
  }),
  tree: (state) => (query = {}) => {
    const array = collectionList(state.data, query);

    const map = new Map();

    for (const item of array) {
      if (map.has(item.parentExternalId)) map.get(item.parentExternalId).push(item);
      else map.set(item.parentExternalId, [item]);
    }

    for (const items of map.values()) {
      for (const item of items) {
        if (map.has(item.externalId)) item.children = map.get(item.externalId);
      }
    }

    return map.get('');
  }
};

const ACTIONS = {
  fetch({ commit }) {
    return disciplinesService.getAllDisciplines()
      .then((disciplines) => {
        commit('setList', disciplines);
      });
  }
};

const MUTATIONS = {
  setList(state, payload) {
    if (!payload) return;

    state.data = collectionMerge(
      state.data,
      payload.map((discipline) => camelizeObjectKeys(discipline)),
      { key: 'externalId' }
    );
  }
};

export const disciplinesStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
