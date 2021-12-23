import { ProjectService } from '@deip/project-service';
import {
  getActionByPath,
  camelizeObjectKeys
} from '@/utils/helpers';
import { USER_BOOKMARK_TYPE } from '@/variables';

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
    portal: {
      all: 'getPortalProjects'
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
    else if (payload.portalId) target.push('portal');
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
      .filter((b) => b.type === USER_BOOKMARK_TYPE.PROJECT)
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

  // portal

  getPortalProjects({ commit }, { portalId }) {
    return projectService.getPortalProjectListing(portalId)
      .then((result) => {
        commit('storeProjectsData', result);
      });
  }
  
};

const MUTATIONS = {
  storeProjectsData(state, payload) {
    // state.projectsList = payload.map((item) => (camelizeObjectKeys(item))).sort(
    //   (p1, p2) => new Date(p1.createdAt) - new Date(p2.createdAt)
    // );
    state.projectsList = payload.sort(
      (p1, p2) => new Date(p1.createdAt) - new Date(p2.createdAt)
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
