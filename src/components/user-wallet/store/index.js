import Vue from 'vue';
import deipRpc from '@deip/deip-oa-rpc-client';
import * as usersService from './../../../utils/user';

const state = {
  researches: [],
  transfers: [],
  researchTokens: [],
  researchTokensHolders: [],
  researchGroups: []
};

// getters
const getters = {
  investments: (state, getters, rootState, rootGetters) => {
    return state.researches.map(research => {
      let user = rootGetters['auth/user'];
      let myShare = state.researchTokens.find(rt => rt.account_name == user.account.name && rt.research_id == research.id);
      let researchShares = state.researchTokens.filter(rt => rt.research_id == research.id);
      let researchSharesHolders = state.researchTokensHolders.filter(user => researchShares.some(rt => rt.account_name == user.account.name));
      let group = state.researchGroups.find(group => group.id == research.research_group_id);

      let shareHolders = researchSharesHolders.map((shareHolder) => {
        let share = researchShares.find(rt => rt.account_name == shareHolder.account.name);
        return { ...shareHolder, share };
      });
      
      return { research, group, myShare, shareHolders };
    })
  },

  transfers: state => state.transfers
};

// actions
const actions = {
  loadWallet({ dispatch, rootGetters }) {
    let user = rootGetters['auth/user'];
    let username = user.account.name;
    return Promise.all([
      dispatch('loadResearchTokens', username),
      dispatch('loadTransfers', username)
    ]);
  },

  loadResearchTokens({ state, commit }, username) {
    return deipRpc.api.getResearchTokensByAccountNameAsync(username)
      .then(myResearchTokens => {
        return Promise.all(myResearchTokens.map(rt => deipRpc.api.getResearchByIdAsync(rt.research_id)));
      })
      .then(researches => {
        commit('SET_RESEARCHES', researches);
        return Promise.all(researches.map(research => deipRpc.api.getResearchTokensByResearchIdAsync(research.id)));
      })
      .then(result => { // all share holders
        const researchTokens = [].concat.apply([], result);
        commit('SET_RESEARCH_TOKENS', researchTokens);

        const distinct = researchTokens.reduce((unique, share) => {
          if (unique.some(user => share.account_name == user)) return unique;
          return [share.account_name, ...unique];
        }, []);
        return usersService.getEnrichedProfiles(distinct);
      })
      .then(researchTokensHolders => {
        commit('SET_RESEARCH_TOKENS_HOLDERS', researchTokensHolders);
        return Promise.all(state.researches.map(research => deipRpc.api.getResearchGroupByIdAsync(research.research_group_id)));
      })
      .then(groups => {
        commit('SET_RESEARCH_GROUPS', groups);
      });
  },

  loadTransfers({ commit }, username) {
    return deipRpc.api.getAccountDeipToDeipTransfersAsync(username, -1, 30)
      .then(transfers => {
        commit('SET_TRANSFERS', transfers.reverse());
      });
  }
};

// mutations
const mutations = {
  ['SET_RESEARCHES'](state, list) {
    Vue.set(state, 'researches', list);
  },

  ['SET_RESEARCH_TOKENS'](state, list) {
    Vue.set(state, 'researchTokens', list);
  },

  ['SET_RESEARCH_TOKENS_HOLDERS'](state, list) {
    Vue.set(state, 'researchTokensHolders', list);
  },

  ['SET_TRANSFERS'](state, list) {
    Vue.set(state, 'transfers', list);
  },

  ['SET_RESEARCH_GROUPS'](state, list) {
    Vue.set(state, 'researchGroups', list);
  }
};

const namespaced = true;

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
