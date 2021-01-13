import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import where from 'filter-where';

const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state, getters, rootState, rootGetters) => state.data.filter(
    where({
      external_id: rootGetters['Disciplines/topLevelList']().map(({ externalId }) => externalId)
    })
  )
};

const ACTIONS = {
  get(context, payload = {}) {
    return expertiseContributionsService.getDisciplinesExpertiseStatsHistory(payload)
      .then((res) => {
        context.commit('store', res);
      });
  }
};

const MUTATIONS = {
  store(state, payload) {
    state.data = payload.map((a) => ({
      external_id: a[0],
      history: a[1]
    }));
  }
};

export const disciplinesGrowthRateStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
