
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';

const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const criteriaTypes = {
  1: 'Impact',
  2: 'Novelty',
  3: 'Excelence',
  4: 'Rationality',
  5: 'Technical Quality',
  6: 'Replication'
};

const state = {
  criteriaTypes,
  disciplinesExpertiseStats: [],
  disciplinesExpertiseStatsHistory: [],
};

const getters = {
  criteriaTypes: () => state.criteriaTypes,
  disciplinesExpertiseStats: () => state.disciplinesExpertiseStats,
  disciplinesExpertiseStatsHistory: () => state.disciplinesExpertiseStatsHistory,

};

const actions = {
  getDisciplinesExpertiseLastStats(context) {
    return expertiseContributionsService.getDisciplinesExpertiseLastStats()
      .then((res) => {
        context.commit('getDisciplinesExpertiseLastStats', res);
      });
  },

  getDisciplinesExpertiseStatsHistory(context) {
    return expertiseContributionsService.getDisciplinesExpertiseStatsHistory({})
      .then((res) => {
        context.commit('getDisciplinesExpertiseStatsHistory', res);
      });
  },


};

const mutations = {
  getDisciplinesExpertiseLastStats(state, payload) {
    state.disciplinesExpertiseStats = payload.map((a) => a[1]);
  },
  getDisciplinesExpertiseStatsHistory(state, payload) {
    state.disciplinesExpertiseStatsHistory = payload.map((a) => ({
      external_id: a[0],
      history: a[1]
    }));
  },
};

export const overviewStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
