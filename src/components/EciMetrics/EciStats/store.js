import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import deepmerge from 'deepmerge';

const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const statsMethod = (payload) => {
  let serviceMethod;

  if (payload.researchId) {
    serviceMethod = expertiseContributionsService
      .getResearchExpertiseStats(payload.researchId, payload.filter);
  } else if (payload.contentId) {
    serviceMethod = expertiseContributionsService
      .getResearchContentExpertiseStats(payload.contentId, payload.filter);
  } else if (payload.accountName) {
    serviceMethod = expertiseContributionsService
      .getAccountExpertiseStats(payload.accountName, payload.filter);
  } else {
    // serviceMethod = expertiseContributionsService
    //   .getDisciplineExpertiseStats(payload.filter);
  }

  return serviceMethod;
};

const STATE = {
  expertiseStats: {},
  expertiseStatsByDisciplines: []
};

const GETTERS = {
  expertiseStats: (state) => state.expertiseStats,
  expertiseStatsByDisciplines: (state) => state.expertiseStatsByDisciplines
};

const ACTIONS = {
  getExpertiseStats({ commit }, payload) {
    return statsMethod(payload)
      .then((res) => {
        commit('storeExpertiseStats', res);
      }, (err) => {
        console.error(err);
      });
  },

  getExpertiseStatsByDisciplines({ commit }, payload) {
    const promises = payload.disciplines.map((d) => {
      const newPayload = deepmerge(
        payload,
        {
          filter: { discipline: d.external_id }
        }
      );

      return statsMethod(newPayload);
    });

    return Promise.all(promises)
      .then((res) => {
        const result = res.map((item, index) => ({
          discipline: payload.disciplines[index],
          ...item
        }));

        commit('storeExpertiseStatsByDisciplines', result);
      }, (err) => {
        console.error(err);
      });
  }
};

const MUTATIONS = {
  storeExpertiseStats(state, payload) {
    state.expertiseStats = payload;
  },

  storeExpertiseStatsByDisciplines(state, payload) {
    state.expertiseStatsByDisciplines = payload;
  }
};

export const eciStatsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
