import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client';
import Vue from 'vue';
import { getEnrichedProfiles } from './../../../utils/user';
import { stat } from 'fs';
import { fromAssetsToFloat } from './../../../utils/blockchain';
import {
  WITHDRAWAL_PENDING,
  WITHDRAWAL_CERTIFIED,
  WITHDRAWAL_APPROVED,
  WITHDRAWAL_REJECTED,

  loadFundingContract
} from './../../../services/FundingService';

const state = {
  isLoadingAwardDetailsPage: false,
  organization: undefined,
  contract: undefined
}

// getters
const getters = {
  isLoadingAwardDetailsPage: (state) => state.isLoadingAwardDetailsPage,
  organization: (state) => state.organization,

  award: (state) => {
    let c = state.contract;
    let rel = c.relations[0];
    let totalAmount = fromAssetsToFloat(rel.total_amount);
    let universityOverheadAmount = totalAmount - (totalAmount - (totalAmount * (rel.university_overhead / 100) / 100));
    let pendingAmount = 0;
    let withdrawnAmount = 0;
    let requestedAmount = 0;

    for (let i = 0; i < rel.withdrawals.length; i++) {
      let withdrawal = rel.withdrawals[i];
      if (withdrawal.status == WITHDRAWAL_PENDING || withdrawal.status == WITHDRAWAL_CERTIFIED) pendingAmount += fromAssetsToFloat(withdrawal.amount);
      if (withdrawal.status == WITHDRAWAL_APPROVED) withdrawnAmount += fromAssetsToFloat(withdrawal.amount);
      requestedAmount += fromAssetsToFloat(withdrawal.amount);
    }

    let availableAmount = totalAmount - pendingAmount - withdrawnAmount - universityOverheadAmount;
    let remainingAmount = totalAmount - requestedAmount - universityOverheadAmount;
    if (remainingAmount != availableAmount) {
      console.warn(`WARNING: award available amount (${availableAmount}) is not equal to remaining amount (${remainingAmount})`);
    }

    let subawardeesAmount = 0;
    let requestedSubawardeesAmount = 0;
    let piAmount = totalAmount - subawardeesAmount - universityOverheadAmount;
    let requestedPiAmount = requestedAmount;

    let org = state.organization;
    let pi = rel.researcherUser;
    let award = {
      id: rel.id,
      awardId: rel.id,
      totalAmount,
      availableAmount,
      remainingAmount,
      pendingAmount,
      withdrawnAmount,
      requestedAmount,
      universityOverheadAmount,

      piAmount,
      requestedPiAmount,

      subawardeesAmount,
      requestedSubawardeesAmount,
      from: c.foa.open_date,
      to: c.foa.close_date,
      contract: c,
      relation: rel,
      org,
      pi
    }
    return award;
  },

  payments: state => {

    let rels = state.contract.relations;
    if (!rels.length) return [];

    let items = []; 

    for (let j = 0; j < rels.length; j++) {
      let rel = rels[j];
      let org = state.organization;
      let pi = rel.researcherUser;
      for (let i = 0; i < rel.withdrawals.length; i++) {
        let withdrawal = rel.withdrawals[i];
        let item = {
          id: withdrawal.id,
          paymentId: withdrawal.id,
          awardId: rel.id,
          amount: fromAssetsToFloat(withdrawal.amount),
          status: withdrawal.status,
          award: rel,
          attachment: withdrawal.attachment,
          timestamp: withdrawal.time,
          org,
          pi,
          requester: pi
        }
        items.push(item);
      }
    }

    return items;
  }
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