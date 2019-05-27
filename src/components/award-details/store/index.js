import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client';
import Vue from 'vue';
import { getEnrichedProfiles } from './../../../utils/user';
import { loadFundingContract } from './../../../services/FundingService';
import { stat } from 'fs';

const state = {
  isLoadingAwardDetailsPage: false,
  organization: undefined,
  contract: undefined
}

// getters
const getters = {
  isLoadingAwardDetailsPage: (state) => state.isLoadingAwardDetailsPage,
  organization: (state) => state.organization,
  award: (state) => state.contract
}

// actions
const actions = {

  loadAwardDetailsPage({ commit, dispatch, state }, { orgPermlink, awardId }) {
    commit('SET_AWARD_DETAILS_LOADING_STATE', true);
    return deipRpc.api.getOrganisationByPermlinkAsync(orgPermlink).then(org => {
      commit('SET_ORGANIZATION', org);

      const awardsLoad = new Promise((resolve, reject) => {
        dispatch('loadAward', { notify: resolve, awardId });
      });

      return Promise.all([awardsLoad]);
    })
      .then(() => {
        
      })
      .finally(() => {
        commit('SET_AWARD_DETAILS_LOADING_STATE', false);
      });
  },

  loadAward({ commit, dispatch, state }, { awardId, notify }) {
    return loadFundingContract(awardId)
      .then(contract => {
        commit('SET_FUNDING_CONTRACT', contract);
      })
      .catch(err => { console.log(err) })
      .finally(() => {
        if (notify) notify();
      });
  }

}

// mutations
const mutations = {

  ['SET_AWARD_DETAILS_LOADING_STATE'](state, value) {
    state.isLoadingAwardDetailsPage = value
  },

  ['SET_ORGANIZATION'](state, org) {
    Vue.set(state, 'organization', org);
  },

  ['SET_FUNDING_CONTRACT'](state, contract) {
    Vue.set(state, 'contract', contract);
  },

}

const namespaced = true;

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}