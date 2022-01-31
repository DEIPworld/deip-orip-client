import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import where from 'filter-where';

const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state, getters, rootState, rootGetters) => state.data.filter(
    where({
      _id: rootGetters['Domains/topLevelList']().map(({ _id }) => _id)
    })
  )
};

const ACTIONS = {
  get(context, payload = {}) {
    return expertiseContributionsService.getDomainsExpertiseStatsHistory(payload)
      .then(({ data: { items: res } }) => {
        context.commit('store', res);
      });
  }
};

const MUTATIONS = {
  store(state, payload) {
    state.data = payload.map((a) => ({
      _id: a[0],
      history: a[1]
    }));
  }
};

export const domainsGrowthRateStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
