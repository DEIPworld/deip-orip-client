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
  WITHDRAWAL_PAID,
  WITHDRAWAL_REJECTED,

  loadFundingContract
} from './../../../services/FundingService';

const state = {
  isLoadingAwardDetailsPage: false,
  organization: undefined,
  award: undefined,
  contract: undefined
}

// getters
const getters = {
  isLoadingAwardDetailsPage: (state) => state.isLoadingAwardDetailsPage,
  organization: (state) => state.organization,

  award: (state) => {
    let rel = state.award;
    let totalAmount = fromAssetsToFloat(rel.total_amount);
    let universityOverheadAmount = rel.isSubaward ? 0 : (totalAmount - (totalAmount - (totalAmount * (rel.university_overhead / 100) / 100)));
    let pendingAmount = 0;
    let withdrawnAmount = 0;
    let requestedPiAmount = 0;
    
    for (let i = 0; i < rel.withdrawals.length; i++) {
      let withdrawal = rel.withdrawals[i];
      if (withdrawal.status == WITHDRAWAL_PENDING || withdrawal.status == WITHDRAWAL_CERTIFIED || withdrawal.status == WITHDRAWAL_APPROVED) pendingAmount += fromAssetsToFloat(withdrawal.amount);
      if (withdrawal.status == WITHDRAWAL_PAID) withdrawnAmount += fromAssetsToFloat(withdrawal.amount);
      requestedPiAmount += fromAssetsToFloat(withdrawal.amount);
    }

    let subawardeesAmount = rel.subawards
      .map(s => s.total_amount.amount)
      .reduce((sum, amount) => sum + amount, 0);

    let requestedSubawardeesAmount = rel.subawards
      .map(s => s.withdrawals.map(w => w.amount.amount).reduce((sum, amount) => sum + amount, 0))
      .reduce((sum, amount) => sum + amount, 0);

    let remainingSubawardeesAmount = subawardeesAmount - requestedSubawardeesAmount;

    let piAmount = totalAmount - subawardeesAmount - universityOverheadAmount;
    let remainingPiAmount = piAmount - requestedPiAmount;

    let remainingAmount = totalAmount - requestedPiAmount - requestedSubawardeesAmount - universityOverheadAmount;

    let contract = state.contract;

    let award = {
      id: rel.id,
      awardId: rel.id,
      isSubaward: rel.isSubaward,
      parentAward: rel.parentAward,

      totalAmount,
      remainingAmount,
      universityOverheadAmount,

      piAmount,
      requestedPiAmount,
      remainingPiAmount,

      subawardeesAmount,
      requestedSubawardeesAmount,
      remainingSubawardeesAmount,

      from: contract.foa.open_date,
      to: contract.foa.close_date,
      contract,
      relation: rel,
      organization: rel.organization,
      pi: rel.researcherUser
    }
    return award;
  },

  subawards: (state) => {
    let rel = state.award;
    if (!rel.hasSubawards) return [];

    let subawards = rel.subawards.map(subaward => {

      let totalSubawardAmount = fromAssetsToFloat(subaward.total_amount);
      let pendingAmount = 0;
      let withdrawnAmount = 0;
      let requestedSubawardAmount = 0;

      for (let i = 0; i < subaward.withdrawals.length; i++) {
        let withdrawal = subaward.withdrawals[i];
        if (withdrawal.status == WITHDRAWAL_PENDING || withdrawal.status == WITHDRAWAL_CERTIFIED || withdrawal.status == WITHDRAWAL_APPROVED) pendingAmount += fromAssetsToFloat(withdrawal.amount);
        if (withdrawal.status == WITHDRAWAL_PAID) withdrawnAmount += fromAssetsToFloat(withdrawal.amount);
        requestedSubawardAmount += fromAssetsToFloat(withdrawal.amount);
      }

      let remainingSubawardAmount = totalSubawardAmount - requestedSubawardAmount;

      let subawardee = subaward.researcherUser;
      let contract = state.contract;

      let sub = {
        id: subaward.id,
        subawardId: subaward.id,
        totalSubawardAmount,
        remainingSubawardAmount,
        requestedSubawardAmount,
        from: contract.foa.open_date,
        to: contract.foa.close_date,
        contract,
        relation: subaward,
        organization: subaward.organization,
        subawardee
      }

      return sub;
    });

    return [].concat.apply([], subawards);
  },

  payments: state => {

    let rels = [];
    let award = state.award;

    if (award.isSubaward) {
      rels.push(award);
    } else {
      rels.push(...state.contract.relations);
    }

    let contract = state.contract;

    let items = [];
    for (let j = 0; j < rels.length; j++) {
      let rel = rels[j];
      let pi = rel.isSubaward ? rel.parentAward.researcherUser : rel.researcherUser;
      let requester = rel.researcherUser;

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
          organization: rel.organization,
          contract,
          pi,
          requester
        }
        items.push(item);
      }
    }

    return items;
  }
}

// actions
const actions = {

  loadAwardDetailsPage({ commit, dispatch, state }, { orgPermlink, contractId, awardId }) {
    commit('SET_AWARD_DETAILS_LOADING_STATE', true);
    return deipRpc.api.getOrganisationByPermlinkAsync(orgPermlink)
      .then(org => {
        commit('SET_ORGANIZATION', org);

        const awardsLoad = new Promise((resolve, reject) => {
          dispatch('loadAward', { contractId, awardId, notify: resolve });
        });

        return Promise.all([awardsLoad]);
      })
      .finally(() => {
        commit('SET_AWARD_DETAILS_LOADING_STATE', false);
      });
  },

  loadAward({ commit, dispatch, state }, { contractId, awardId, notify }) {
    return loadFundingContract(contractId)
      .then(contract => {
        let award = contract.relations.find(r => r.id == awardId);
        commit('SET_AWARD', award);
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

  ['SET_AWARD'](state, award) {
    Vue.set(state, 'award', award);
  }
}

const namespaced = true;

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}