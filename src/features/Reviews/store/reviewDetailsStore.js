import deipRpc from '@deip/rpc-client';
import { camelizeObjectKeys } from '@/utils/helpers';

const STATE = {
  reviewDetails: []
};

const GETTERS = {
  reviewDetails: (state) => state.reviewDetails
};

const ACTIONS = {
  getReviewDetails({ commit }, reviewExternalId) {
    return deipRpc.api.getReviewAsync(reviewExternalId)
      .then((res) => {
        commit('storeReviewDetails', res);
      });
  }
};

const MUTATIONS = {
  storeReviewDetails(state, payload) {
    state.reviewDetails = camelizeObjectKeys(payload);
  }
};

export const reviewDetailsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};