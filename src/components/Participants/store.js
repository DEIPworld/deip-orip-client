import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';

const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const state = {
  participants: []
};

// getters
const getters = {
  participants: (state) => state.participants
};

// actions
const actions = {

  loadAllParticipants({
    state, dispatch
  }, { filter }) {
    return Promise.all([
      dispatch('loadFilterParticipants', { filter })
    ]);
  },

  loadFilterParticipants({ commit }, { filter } = {}) {
    return expertiseContributionsService
      .getAccountsExpertiseStats(filter)
      .then((list) => {
        commit('SET_PARTICIPANTS', list);
      });
  }
};

// mutations
const mutations = {
  SET_PARTICIPANTS(state, participants) {
    state.participants = participants;
  }
};

const namespaced = true;

export const participantsStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
