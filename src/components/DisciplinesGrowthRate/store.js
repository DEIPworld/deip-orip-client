import { getTopLevelNodes } from '@/components/common/disciplines/DisciplineTreeService';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import where from 'filter-where';

const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const state = {
  data: []
};

const getters = {
  // data: () => getTopLevelNodes().map(({ id }) => state.disciplinesGrowthRate.find(({ external_id }) => id === external_id)),
  list: () => state.data.filter(
    where({
      external_id: getTopLevelNodes().map(({ id }) => id)
    })
  )
};

const actions = {
  get(context, payload = {}) {
    return expertiseContributionsService.getDisciplinesExpertiseStatsHistory(payload)
      .then((res) => {
        context.commit('store', res);
      });
  }
};

const mutations = {
  store(state, payload) {
    state.data = payload.map((a) => ({
      external_id: a[0],
      history: a[1]
    }));
  }
};

export const disciplinesGrowthRateStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
