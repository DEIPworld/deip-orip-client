import { ProjectContentService } from '@deip/project-content-service';
import { ReviewService } from '@deip/review-service';
import {
  getActionByPath,
  camelizeObjectKeys
} from '@/utils/helpers';

const reviewService = ReviewService.getInstance();
const projectContentService = ProjectContentService.getInstance();

const actionsMap = {
  project: 'getContentsByProject'
};

const getAction = getActionByPath(actionsMap).get;

const STATE = {
  contentsList: []
};

const GETTERS = {
  contentsList: (state) => state.contentsList
};

const ACTIONS = {
  getContents({ dispatch }, payload) {
    let target;
    if (payload.projectId) target = 'project';
    return dispatch(getAction(target), payload);
  },

  getContentsByProject({ commit }, { projectId }) {
    const researchContents = [];

    return projectContentService.getProjectContentsByProject(projectId)
      .then((list) => {
        researchContents.push(...list.filter((researchContent) => !researchContent.isDraft));
        return Promise.all(
          researchContents.map(
            (content) => reviewService.getReviewsByProjectContent(content.external_id)
          )
        );
      })
      .then((reviews) => {
        researchContents.forEach((content, index) => {
          content.reviews = reviews[index];
        });

        commit('storeContents', researchContents);
      })
      .catch((err) => { console.error(err); });
  },
};

const MUTATIONS = {
  storeContents(state, payload) {
    state.contentsList = payload.map((item) => camelizeObjectKeys(item));
  }
};

export const contentListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
