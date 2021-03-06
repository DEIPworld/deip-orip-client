import { ProjectService } from '@deip/project-service';
import { camelizeObjectKeys } from '@/utils/helpers';

const projectService = ProjectService.getInstance();

const STATE = {
  projectDetails: {}
};

const GETTERS = {
  projectDetails: (state) => state.projectDetails
};

const ACTIONS = {
  getProjectDetails({ commit }, projectId) {
    return projectService.getProject(projectId)
      .then(({ data: res }) => {
        commit('storeProjectDetails', res);
      });
  }
};

const MUTATIONS = {
  storeProjectDetails(state, project) {
    // state.projectDetails = camelizeObjectKeys(project);
    state.projectDetails = project;
  }
};

export const projectDetailsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
