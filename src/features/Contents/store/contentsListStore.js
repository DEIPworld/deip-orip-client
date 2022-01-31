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
    const projectContents = [];

    return projectContentService.getProjectContentsByProject(projectId)
      .then(({ data: { items: list } }) => {
        projectContents.push(...list.filter((projectContent) => !projectContent.isDraft));
        return Promise.all(
          projectContents.map(
            (content) => reviewService.getReviewsByProjectContent(content._id)
          )
        );
      })
      .then((res) => {
        const reviews = res.map(({ data: { items } }) => items)
        projectContents.forEach((content, index) => {
          content.reviews = reviews[index];
        });

        commit('storeContents', projectContents);
      })
      .catch((err) => { console.error(err); });
  },
};

const MUTATIONS = {
  storeContents(state, payload) {
    // state.contentsList = payload.map((item) => camelizeObjectKeys(item));
    state.contentsList = payload;
  }
};

export const contentListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
