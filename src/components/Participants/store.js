import Vue from 'vue';
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
    state, dispatch, commit, rootGetters
  }, { filter }) {
    const filterParticipantsLoad = new Promise((resolve, reject) => {
      dispatch('loadFilterParticipants', {
        filter,
        notify: resolve
      });
    });

    return Promise.all([filterParticipantsLoad]);
  },

  loadFilterParticipants({ commit }, { filter, notify } = {}) {
    return expertiseContributionsService
      .getAccountsExpertiseStats(filter)
      .then((list) => {
        commit('SET_PARTICIPANTS', list);
      })
      .finally(() => {
        if (notify) notify();
      });
  }
};

// mutations
const mutations = {
  SET_PARTICIPANTS(state, participants) {
    Vue.set(state, 'participants', participants);
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
