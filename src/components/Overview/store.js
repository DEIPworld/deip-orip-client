import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';

const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const criteriaTypes = {
  1: 'Impact',
  2: 'Novelty',
  3: 'Excelence',
  4: 'Rationality',
  5: 'Technical Quality',
  6: 'Replication',
  7: 'Commercialization'
};

const state = {
  criteriaTypes,
  domainsExpertiseStats: [],
  domainsExpertiseStatsHistory: []
};

const getters = {
  criteriaTypes: () => state.criteriaTypes,
  domainsExpertiseStats: () => state.domainsExpertiseStats,
  domainsExpertiseStatsHistory: () => state.domainsExpertiseStatsHistory

};

const actions = {
  getDomainsExpertiseLastStats(context) {
    return expertiseContributionsService.getDomainsExpertiseLastStats()
      .then(({ data: { items: res } }) => {
        context.commit('getDomainsExpertiseLastStats', res);
      });
  },

  getDomainsExpertiseStatsHistory(context) {
    return expertiseContributionsService.getDomainsExpertiseStatsHistory({})
      .then(({ data: { items: res } }) => {
        context.commit('getDomainsExpertiseStatsHistory', res);
      });
  }

};

const mutations = {
  getDomainsExpertiseLastStats(state, payload) {
    state.domainsExpertiseStats = payload.map((a) => a[1]);
  },
  getDomainsExpertiseStatsHistory(state, payload) {
    state.domainsExpertiseStatsHistory = payload.map((a) => ({
      _id: a[0],
      history: a[1]
    }));
  }
};

export const overviewStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
