import { ResearchService } from '@deip/research-service';
import { getNestedValue } from 'vuetify/lib/util/helpers';

const researchService = ResearchService.getInstance();

const actionsMap = {
  projects: {
    public: {
      approved: '1',
      pending: '2',
      rejected: '3',
      deleted: '4'
    },
    user: {
      approved: '5',
      pending: '6',
      rejected: '7',
      deleted: '8'
    },
    team: {
      approved: '9',
      pending: '10',
      rejected: '11',
      deleted: '12'
    }
  },
  applications: {
    public: {
      approved: '13',
      pending: '14',
      rejected: '15',
      deleted: '16'
    },
    user: {
      approved: '',
      pending: '',
      rejected: '',
      deleted: ''
    }
  }
};

const getActionScope = (payload = {}) => {
  const scope = payload.scope || 'projects';
  return scope;
};

const getActionType = (payload = {}) => {
  if (payload.type) return payload.type;
  if (payload.userName) return 'user';
  if (payload.teamId) return 'team';
  return 'public';
};

const getActionStatus = (payload = {}) => {
  const status = payload.status || 'approved';
  return status;
};

const getActionFrom = (map, getters) => {
  const getters$ = !getters ? [
    getActionScope,
    getActionType,
    getActionStatus
  ] : getters;

  return {
    get(payload = {}) {
      const path = getters$.map((getter) => getter(payload)).join('.');
      return getNestedValue(map, path);
    }
  };
};

const actionFor = getActionFrom(actionsMap).get;
const action = actionFor({ userName: 'xxx' });

const STATE = {
  list: []
};

const GETTERS = {
  list: (state) => state.list
};

const ACTIONS = {

  getListing({ dispatch }, { userName, teamId, applications }) {
    if (applications) {
      return dispatch('getApplications', { userName, applications });
    }

    return dispatch('getProjects', { userName, teamId });
  },

  // PROJECTS

  getProjects({ dispatch }, { userName, teamId }) {
    if (userName) {
      return dispatch('getUserProjects', userName);
    }

    if (teamId) {
      return dispatch('getTeamProjects', teamId);
    }

    return dispatch('getPublicProjects');
  },

  getPublicProjects({ commit }) {
    return researchService.getPublicResearchListing({})
      .then((result) => {
        commit('storeProjectsList', result);
      });
  },

  getUserProjects({ commit }, userName) {
    return researchService.getUserResearchListing(userName)
      .then((result) => {
        commit('storeProjectsList', result);
      });
  },

  getTeamProjects({ commit }, teamId) {
    return researchService.getResearchGroupResearchListing(teamId)
      .then((result) => {
        commit('storeProjectsList', result);
      });
  },

  // APPLICATIONS

  // global

  getApplications({ commit }, { userName, status }) {

  },

  getPendingApplications({ commit }) {
    return researchService.getPendingResearchApplications()
      .then((result) => {
        commit('storeProjectsList', result);
      });
  },

  getApprovedApplications({ commit }) {
    return researchService.getApprovedResearchApplications()
      .then((result) => {
        commit('storeProjectsList', result);
      });
  },

  getRejectedApplications({ commit }) {
    return researchService.getRejectedResearchApplications()
      .then((result) => {
        commit('storeProjectsList', result);
      });
  },

  getDeletedApplications({ commit }) {
    return researchService.getDeletedResearchApplications()
      .then((result) => {
        commit('storeProjectsList', result);
      });
  },

  // by user

  getUserPendingApplications({ commit }, { userName }) {
    return researchService.getPendingResearchApplicationsByResearcher(userName)
      .then((result) => {
        commit('storeProjectsList', result);
      });
  },

  getUserApprovedApplications({ commit }, { userName }) {
    return researchService.getApprovedResearchApplicationsByResearcher(userName)
      .then((result) => {
        commit('storeProjectsList', result);
      });
  },

  getUserRejectedApplications({ commit }, { userName }) {
    return researchService.getRejectedResearchApplicationsByResearcher(userName)
      .then((result) => {
        commit('storeProjectsList', result);
      });
  },

  getUserDeletedApplications({ commit }, { userName }) {
    return researchService.getDeletedResearchApplicationsByResearcher(userName)
      .then((result) => {
        commit('storeProjectsList', result);
      });
  }
};

const MUTATIONS = {
  storeProjectsList(state, payload) {
    state.publicProjects = payload;
  }
};

export const adminPanelStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
