import where from 'filter-where';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';

const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const state = {
  disciplinesExpertiseStats: [],
  disciplinesExpertiseStatsHistory: [],
  researchContentsExpertiseHistory: []
};

const getters = {
  disciplinesExpertiseStats: () => state.disciplinesExpertiseStats,
  disciplinesExpertiseStatsHistory: () => state.disciplinesExpertiseStatsHistory,
  researchContentsExpertiseHistory: () => state.researchContentsExpertiseHistory
};

const actions = {
  getDisciplinesExpertiseStats(context) {
    return expertiseContributionsService.getDisciplinesExpertiseStats()
      .then((res) => {
        context.commit('getDisciplinesExpertiseStats', res);
      });
  },

  getDisciplinesExpertiseStatsHistory(context) {
    return expertiseContributionsService.getDisciplinesExpertiseStatsHistory()
      .then((res) => {
        context.commit('getDisciplinesExpertiseStatsHistory', res);
      });
  },

  getResearchContentsExpertiseHistory(context) {
    return expertiseContributionsService.getResearchContentsExpertiseHistory()
      .then((res) => {
        context.commit('getResearchContentsExpertiseHistory', res);
      });
  },

  getAll(context) {
    return Promise.all([
      context.dispatch('getDisciplinesExpertiseStats'),
      context.dispatch('getDisciplinesExpertiseStatsHistory'),
      // context.dispatch('getResearchContentsExpertiseHistory')
    ]);
  }
};

const mutations = {
  getDisciplinesExpertiseStats(state, payload) {
    state.disciplinesExpertiseStats = payload.map((a) => a[1]);
  },
  getDisciplinesExpertiseStatsHistory(state, payload) {
    state.disciplinesExpertiseStatsHistory = payload.map((a) => ({ external_id: a[0], history: a[1] }));
  },
  getResearchContentsExpertiseHistory(state, payload) {
    state.researchContentsExpertiseHistory = payload;
  }
};

export const overviewStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
