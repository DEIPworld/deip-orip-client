import { ReviewService } from '@deip/review-service';
import { ProjectService } from '@deip/project-service';
import { UserService } from '@deip/user-service';
import { ProjectContentService } from '@deip/project-content-service';

const projectContentService = ProjectContentService.getInstance();
const userService = UserService.getInstance();
const projectService = ProjectService.getInstance();
const reviewService = ReviewService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state) => state.data
};

const ACTIONS = {
  fetch({ commit }, username) {
    const reviewRequests = [];
    return reviewService.getReviewRequestsByExpert(username, 1)
      .then(({ data: { items: results } }) => {
        const detailsPromises = [];
        reviewRequests.push(...results);
        reviewRequests.forEach((r) => {
          detailsPromises.push(
            projectContentService.getProjectContent(r.projectContentId)
              .then(({ data: content }) => {
                r.content = content;
                return projectService.getProject(content.projectId);
              }).then(({ data: project }) => {
                r.project = project;
              })
          );
        });
        return Promise.all(detailsPromises);
      })
      .then(() => userService.getUsers(reviewRequests.map((r) => r.requestor)))
      .then(({ data: { items: users } }) => {
        const requests = reviewRequests.map((r) => (
          { ...r, requestorProfile: users.find(((u) => u.account.name === r.requestor)) }
        ));
        commit('setList', requests);
      });
  }
};

const MUTATIONS = {
  setList(state, payload) {
    state.data = payload;
  }
};

export const reviewRequestsStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
