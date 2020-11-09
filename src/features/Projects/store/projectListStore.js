import { ResearchService } from '@deip/research-service';
import {
  getActionFrom,
  getActionTarget,
  getActionMapKey,
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
  getActionMapKey('type', 'all').get
]).get;

const STATE = {
  projectsList: []
};

const GETTERS = {
  projectsList: (state) => state.projectsList
};

const ACTIONS = {

  getProjectsData({ dispatch }, payload = {}) {
    return dispatch(actionFor(payload), payload);
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
    return Promise.all(
      context
        .rootGetters['auth/user']
        .researchBookmarks.map(({ researchId }) => researchId)
        .map((externalId) => researchService.getResearch(externalId))
    )
      .then((result) => {
        context.commit('storeProjectsData', result);
      });
  },

  // team

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
    // console.log('@@@@', payload)
    state.projectsList = payload.map((item) => (camelizeObjectKeys(item)));
  }
};

export const projectsListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
