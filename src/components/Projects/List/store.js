import { ResearchService } from '@deip/research-service';
import { getActionFrom, getActionTarget, getActionMapKey } from '@/utils/helpers';

const researchService = ResearchService.getInstance();

const actionsMap = {
  projects: {
    public: {
      approved: 'getPublicProjects'
    },
    user: {
      approved: 'getUserProjects'
    },
    team: {
      approved: 'getTeamProjects'
    }
  },
  applications: {
    public: {
      approved: 'getPendingApplications',
      pending: 'getApprovedApplications',
      rejected: 'getRejectedApplications',
      deleted: 'getDeletedApplications'
    },
    user: {
      approved: 'getUserPendingApplications',
      pending: 'getUserApprovedApplications',
      rejected: 'getUserRejectedApplications',
      deleted: 'getUserDeletedApplications'
    }
  }
};

const actionFor = getActionFrom(actionsMap, [
  getActionMapKey('scope', 'projects').get,
  getActionTarget,
  getActionMapKey('status', 'approved').get
]).get;

const STATE = {
  list: []
};

const GETTERS = {
  list: (state) => state.list
};

const ACTIONS = {

  getData({ dispatch }, payload) {
    return dispatch(actionFor(payload), payload);
  },

  // PROJECTS

  getPublicProjects({ commit }, { filter }) {
    return researchService.getPublicResearchListing(filter)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getUserProjects({ commit }, { userName }) {
    return researchService.getUserResearchListing(userName)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getTeamProjects({ commit }, { teamId }) {
    return researchService.getResearchGroupResearchListing(teamId)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  // APPLICATIONS

  // global

  getPendingApplications({ commit }) {
    return researchService.getPendingResearchApplications()
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getApprovedApplications({ commit }) {
    return researchService.getApprovedResearchApplications()
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getRejectedApplications({ commit }) {
    return researchService.getRejectedResearchApplications()
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getDeletedApplications({ commit }) {
    return researchService.getDeletedResearchApplications()
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  // by user

  getUserPendingApplications({ commit }, { userName }) {
    return researchService.getPendingResearchApplicationsByResearcher(userName)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getUserApprovedApplications({ commit }, { userName }) {
    return researchService.getApprovedResearchApplicationsByResearcher(userName)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getUserRejectedApplications({ commit }, { userName }) {
    return researchService.getRejectedResearchApplicationsByResearcher(userName)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getUserDeletedApplications({ commit }, { userName }) {
    return researchService.getDeletedResearchApplicationsByResearcher(userName)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  }
};

const MUTATIONS = {
  storeProjectsData(state, payload) {
    state.publicProjects = payload;
  }
};

export const projectsListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
