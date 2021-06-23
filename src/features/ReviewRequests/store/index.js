import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';
import { ResearchContentService } from '@deip/research-content-service';
import { ProjectService } from '@deip/project-service';
import { UserService } from '@deip/user-service';

const userService = UserService.getInstance();
const projectService = ProjectService.getInstance();
const researchContentService = ResearchContentService.getInstance();
const researchContentReviewsService = ResearchContentReviewsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state) => state.data
};

const ACTIONS = {
  fetch({ commit }, username) {
    const reviewRequests = [];
    return researchContentReviewsService.getReviewRequestsByExpert(username, 'pending')
      .then((results) => {
        const detailsPromises = [];
        reviewRequests.push(...results);
        reviewRequests.forEach((r) => {
          detailsPromises.push(
            researchContentService.getResearchContent(r.researchContentExternalId)
              .then((content) => {
                r.content = content;
                return projectService.getProject(content.research_external_id);
              }).then((research) => {
                r.research = research;
              })
          );
        });
        return Promise.all(detailsPromises);
      })
      .then(() => userService.getUsers(reviewRequests.map((r) => r.requestor)))
      .then((users) => {
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
