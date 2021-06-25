import { ProjectService } from '@deip/project-service';
import {
  getActionByPath,
  camelizeObjectKeys
} from '@/utils/helpers';

import where from 'filter-where';

const projectService = ProjectService.getInstance();

const actionsMap = {
  projects: {
    public: {
      all: 'getPublicProjects'
    },
    user: {
      all: 'getUserProjects',
      following: 'getUserFollowingProjects',
      public: 'getUserPublicProjects',
      teams: 'getUserTeamsProjects',
      personal: 'getUserPersonalProjects'
    },
    team: {
      all: 'getTeamProjects'
    },
    tenant: {
      all: 'getTenantProjects'
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

const getAction = getActionByPath(actionsMap).get;

const STATE = {
  projectsList: []
};

const GETTERS = {
  projectsList: (state) => state.projectsList
};

const ACTIONS = {

  getProjectsData({ dispatch }, payload = {}) {
    const target = [payload.scope];

    if (payload.userName) target.push('user');
    else if (payload.teamId) target.push('team');
    else if (payload.tenantId) target.push('tenant');
    else target.push('public');

    target.push(payload.type || 'all');

    return dispatch(getAction(target), payload);
  },

  // PROJECTS

  // global

  getPublicProjects({ commit }, { filter = {} }) {
    return projectService.getPublicProjectListing(filter)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  // user

  getUserProjects({ commit }, { userName }) {
    return projectService.getUserProjectListing(userName)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getUserPublicProjects({ commit }, { userName }) {
    return projectService.getUserPublicProjects(userName)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getUserTeamsProjects({ commit }, { userName }) {
    return projectService.getUserTeamsProjects(userName)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getUserPersonalProjects({ commit }, { userName }) {
    return projectService.getUserPersonalProjects(userName)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getUserFollowingProjects(context) {
    const ids = context
      .rootGetters['Auth/currentUser']
      .bookmarks
      .filter((b) => b.type === 'research')
      .map((b) => b.ref);

    return ids.length ? projectService.getProjects(ids)
      .then((result) => {
        context.commit('storeProjectsData', result);
      }) : context.commit('storeProjectsData', []);
  },

  // team

  getTeamProjects({ commit }, { teamId }) {
    return projectService.getTeamProjectListing(teamId)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  // tenant

  getTenantProjects({ commit }, { tenantId }) {
    return projectService.getTenantProjectListing(tenantId)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  // APPLICATIONS

  // global

  getPendingApplications({ commit }) {
    return projectService.getPendingProjectApplications()
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getApprovedApplications({ commit }) {
    return projectService.getApprovedProjectApplications()
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getRejectedApplications({ commit }) {
    return projectService.getRejectedProjectApplications()
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getDeletedApplications({ commit }) {
    return projectService.getDeletedProjectApplications()
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  // by user

  getUserPendingApplications({ commit }, { userName }) {
    return projectService.getPendingProjectApplicationsByProject(userName)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getUserApprovedApplications({ commit }, { userName }) {
    return projectService.getApprovedProjectApplicationsByProject(userName)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getUserRejectedApplications({ commit }, { userName }) {
    return projectService.getRejectedProjectApplicationsByProject(userName)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getUserDeletedApplications({ commit }, { userName }) {
    return projectService.getDeletedProjectApplicationsByProject(userName)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  }
};

const MUTATIONS = {
  storeProjectsData(state, payload) {
    state.projectsList = payload.map((item) => (camelizeObjectKeys(item))).sort(
      (p1, p2) => new Date(p1.researchRef.createdAt) - new Date(p2.researchRef.createdAt)
    );
  }
};

export const projectsListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
