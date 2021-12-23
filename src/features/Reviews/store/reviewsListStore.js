import { ReviewService } from '@deip/review-service';
import { contentListStore } from '@/features/Contents/store';

import {
  getActionByPath,
  camelizeObjectKeys
} from '@/utils/helpers';

import { getAdditionalData } from '@/features/Reviews/utils/getAdditionalData';

const reviewService = ReviewService.getInstance();

const actionsMap = {
  project: 'getReviewsByProject',
  content: 'getReviewsByContent'
};

const getAction = getActionByPath(actionsMap).get;

const STATE = {
  reviewsList: [],
};

const GETTERS = {
  reviewsList: (state) => state.reviewsList,
};

const ACTIONS = {
  getReviews({ dispatch }, payload) {
    let target;
    if (payload.projectId) target = 'project';
    if (payload.contentId) target = 'content';

    return dispatch(getAction(target), payload);
  },

  getReviewsByProject({ dispatch, commit }, { projectId }) {
    return reviewService.getReviewsByProject(projectId)
      .then((items) => Promise.all(
        getAdditionalData(items)
      )
        .then((res) => {
          return dispatch('getContentsByProject', { projectId })
            .then(() => {
              commit('storeReviews', res);
            });
        }));
  },

  getReviewsByContent({ commit }, { contentId }) {
    return reviewService.getReviewsByProjectContent(contentId)
      .then((items) => Promise.all(
        getAdditionalData(items)
      )
        .then((res) => {
          commit('storeReviews', res);
        }));
  },

  getContentsByProject: contentListStore.actions.getContentsByProject

};

const MUTATIONS = {
  storeReviews(state, payload) {
    // state.reviewsList = payload.map((item) => (camelizeObjectKeys(item)));
    state.reviewsList = payload;
  },

  storeContents: contentListStore.mutations.storeContents
};

export const reviewsListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
