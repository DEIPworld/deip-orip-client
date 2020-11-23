import {
  getActionByPath,
  camelizeObjectKeys
} from '@/utils/helpers';

import deipRpc from '@deip/rpc-client';

const actionsMap = {
  project: 'getReviewsByProject',
  content: 'getReviewsByContent'
};

const getAction = getActionByPath(actionsMap).get;

const getAdditionalData = (items) => items.map((item) => Promise.all([
  deipRpc.api.getReviewVotesByReviewIdAsync(item.id),
  deipRpc.api.getResearchContentAsync(item.research_content_external_id)
]).then(([votes, contentData]) => ({
  ...item,
  contentData: camelizeObjectKeys(contentData),
  votes,
  supporters: [...new Set(votes.map((v) => v.voter))]
})));

const STATE = {
  reviewsList: []
};

const GETTERS = {
  reviewsList: (state) => state.reviewsList
};

const ACTIONS = {
  getReviews({ dispatch }, payload) {
    let target;
    if (payload.projectId) target = 'project';
    if (payload.contentId) target = 'content';

    return dispatch(getAction(target), payload);
  },

  getReviewsByProject({ commit }, { projectId }) {
    return deipRpc.api.getReviewsByResearchAsync(projectId)
      .then((items) => Promise.all(
        getAdditionalData(items)
      )
        .then((res) => {
          commit('storeReviews', res);
        }));
  },

  getReviewsByContent({ commit }, { contentId }) {
    return deipRpc.api.getReviewsByResearchContentAsync(contentId)
      .then((items) => Promise.all(
        getAdditionalData(items)
      )
        .then((res) => {
          commit('storeReviews', res);
        }));
  }

};

const MUTATIONS = {
  storeReviews(state, payload) {
    state.reviewsList = payload.map((item) => (camelizeObjectKeys(item)));
  }
};

export const reviewsListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
