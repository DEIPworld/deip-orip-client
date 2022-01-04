import { ReviewService } from '@deip/review-service';
import { camelizeObjectKeys } from '@/utils/helpers';
import {
  getAdditionalDataOne
} from '@/features/Reviews/utils/getAdditionalData';

const reviewService = ReviewService.getInstance();

const STATE = {
  reviewDetails: []
};

const GETTERS = {
  reviewDetails: (state) => state.reviewDetails
};

const ACTIONS = {
  getReviewDetails({ commit }, reviewId) {
    return reviewService.getReview(reviewId)
      .then((item) => {
        return getAdditionalDataOne(item)
          .then((res) => {
            commit('storeReviewDetails', res);
          });
      });
  }
};

const MUTATIONS = {
  storeReviewDetails(state, payload) {
    // state.reviewDetails = camelizeObjectKeys(payload);
    state.reviewDetails = payload;
  }
};

export const reviewDetailsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
