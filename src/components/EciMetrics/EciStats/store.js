import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import deepmerge from 'deepmerge';

const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const statsMethod = (payload) => {
  let serviceMethod;

  if (payload.projectId) {
    serviceMethod = expertiseContributionsService
      .getProjectExpertiseStats(payload.projectId, payload.filter);
  } else if (payload.contentId) {
    serviceMethod = expertiseContributionsService
      .getProjectContentExpertiseStats(payload.contentId, payload.filter);
  } else if (payload.accountName) {
    serviceMethod = expertiseContributionsService
      .getAccountExpertiseStats(payload.accountName, payload.filter);
  } else {
    // serviceMethod = expertiseContributionsService
    //   .getDomainExpertiseStats(payload.filter);
  }

  return serviceMethod;
};

const STATE = {
  expertiseStats: {},
  expertiseStatsByDomains: []
};

const GETTERS = {
  expertiseStats: (state) => state.expertiseStats,
  expertiseStatsByDomains: (state) => state.expertiseStatsByDomains
};

const ACTIONS = {
  getExpertiseStats({ commit }, payload) {
    return statsMethod(payload)
      .then(({ data: res }) => {
        commit('storeExpertiseStats', res);
      }, (err) => {
        console.error(err);
      });
  },

  getExpertiseStatsByDomains({ commit }, payload) {
    const promises = payload.domains.map((d) => {
      const newPayload = deepmerge(
        payload,
        {
          filter: { domain: d._id }
        }
      );

      return statsMethod(newPayload);
    });

    return Promise.all(promises)
      .then((r) => {
        const res = r.map(({ data }) => data);
        const result = res.map((item, index) => ({
          domain: payload.domains[index],
          ...item
        }));

        commit('storeExpertiseStatsByDomains', result);
      }, (err) => {
        console.error(err);
      });
  }
};

const MUTATIONS = {
  storeExpertiseStats(state, payload) {
    state.expertiseStats = payload;
  },

  storeExpertiseStatsByDomains(state, payload) {
    state.expertiseStatsByDomains = payload;
  }
};

export const eciStatsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
