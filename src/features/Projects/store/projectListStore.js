import { ResearchService } from '@deip/research-service';
import {
  getActionByPath,
  camelizeObjectKeys
} from '@/utils/helpers';

import where from 'filter-where';

const researchService = ResearchService.getInstance();

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
    return researchService.getPublicResearchListing(filter)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  // user

  getUserProjects({ commit }, { userName }) {
    return researchService.getUserResearchListing(userName)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  getUserPublicProjects({ commit }, { userName }) {
    return researchService.getUserResearchListing(userName)
      .then((result) => {
        commit('storeProjectsData', result.filter(where({ is_private: false })));
      });
  },

  getUserTeamsProjects({ commit }, { userName }) {
    return researchService.getUserResearchListing(userName)
      .then((result) => {
        commit('storeProjectsData', result.filter(where({ research_group: { is_personal: false } })));
      });
  },

  getUserPersonalProjects({ commit }, { userName }) {
    return researchService.getUserResearchListing(userName)
      .then((result) => {
        commit('storeProjectsData', result.filter(where({ research_group: { is_personal: true } })));
      });
  },

  getUserFollowingProjects(context) {
    const ids = context
      .rootGetters['Auth/currentUser']
      .bookmarks
      .filter((b) => b.type === 'research')
      .map((b) => b.ref);

    return ids.length ? researchService.getResearches(ids)
      .then((result) => {
        context.commit('storeProjectsData', result);
      }) : context.commit('storeProjectsData', []);
  },

  // team

  getTeamProjects({ commit }, { teamId }) {
    return researchService.getResearchGroupResearchListing(teamId)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  },

  // tenant

  getTenantProjects({ commit }, { tenantId }) {
    return researchService.getTenantResearchListing(tenantId)
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
