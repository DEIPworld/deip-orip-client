import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client';
import Vue from 'vue';
import { getEnrichedProfiles } from './../../../utils/user';
import { stat } from 'fs';
import { getBlock, getTransaction, getTransactionHex } from './../../../utils/blockchain';
import {
  WITHDRAWAL_PENDING,
  WITHDRAWAL_CERTIFIED,
  WITHDRAWAL_APPROVED,
  WITHDRAWAL_PAID,
  WITHDRAWAL_REJECTED,
  
  loadFundingContract
} from './../../../services/FundingService';
import { get } from 'http';


const state = {
  isLoadingAwardDetailsPage: false,
  historyRecords: [],
  organization: undefined,
  payment: undefined,
  contract: undefined,
  award: undefined
}

// getters
const getters = {
  isLoadingPaymentDetailsPage: (state) => state.isLoadingPaymentDetailsPage,
  organization: (state) => state.organization,
  contract: (state) => state.contract,
  award: (state) => state.award,
  payment: (state) => {

    let pi = state.award.isSubaward ? state.award.parentAward.researcherUser : state.award.researcherUser;
    let requester = state.award.researcherUser;
    let attachmentObj = state.award.withdrawals.find(w => w.id == state.payment.id);

    let payment = {
      id: state.payment.id,
      amount: state.payment.amount.amount,
      status: state.payment.status,
      pi,
      requester,
      organization: state.organization,
      foa: state.contract.foa,
      fundingAgency: { name: state.contract.foa.agency_name.toUpperCase() },
      award: { id: state.award.id, research_id: state.award.research_id },
      timestamp: state.payment.time,
      attachment: attachmentObj ? attachmentObj.attachment : null
    }
    
    return payment;
  },

  historyRecords: (state) => {
    return state.historyRecords
  }
}

// actions
const actions = {

  loadPaymentDetailsPage({ commit, dispatch, state }, { orgPermlink, contractId, awardId, paymentId }) {
    commit('SET_PAYMENT_DETAILS_LOADING_STATE', true);
    return deipRpc.api.getOrganisationByPermlinkAsync(orgPermlink)
      .then(org => {
        commit('SET_ORGANIZATION', org);
        const paymentLoad = new Promise((resolve, reject) => {
          dispatch('loadPayment', { contractId, awardId, paymentId })
            .then(() => {
              dispatch('loadHistoryRecords', { orgId: org.id, contractId, awardId, paymentId, notify: resolve });
            });
        });

        return Promise.all([paymentLoad]);
      })
      .catch(err => { console.log(err) })
      .finally(() => {
        commit('SET_PAYMENT_DETAILS_LOADING_STATE', false);
      });
  },

  loadPayment({ commit, dispatch, state }, { contractId, awardId, paymentId, notify }) {

    return deipRpc.api.getFundingWithdrawalRequestAsync(paymentId)
      .then(payment => {
        commit('SET_PAYMENT', payment);
        return loadFundingContract(contractId)
      })
      .then(contract => {
        let award = contract.relations.find(r => r.id == awardId);
        commit('SET_AWARD', award);
        commit('SET_FUNDING_CONTRACT', contract);
      })
      .catch(err => { console.log(err) })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadHistoryRecords({ commit, dispatch, state }, { orgId, contractId, awardId, paymentId, notify }) {
    const paymentRecords = [];
    return deipRpc.api.getOrganisationHistoryAsync(orgId)
      .then(items => {
        let records = items[0][1];
        let timestamp = state.payment.time;

        let createPaymentOp = records.find(
          r => r.op[0] == "create_funding_withdrawal_request"
            && r.op[1].funding_research_relation_id == awardId
            && r.timestamp == timestamp);
        createPaymentOp.status = WITHDRAWAL_PENDING;
        paymentRecords.push(createPaymentOp);

        let certifyPaymentOp = records.find(
          r => r.op[0] == "certify_funding_withdrawal_request"
            && r.op[1].funding_withdrawal_request_id == paymentId);
        if (certifyPaymentOp) {
          certifyPaymentOp.status = WITHDRAWAL_CERTIFIED;
          paymentRecords.push(certifyPaymentOp);
        }

        let approvePaymentOp = records.find(
          r => r.op[0] == "approve_funding_withdrawal_request"
            && r.op[1].funding_withdrawal_request_id == paymentId);
        if (approvePaymentOp) {
          approvePaymentOp.status = WITHDRAWAL_APPROVED;
          paymentRecords.push(approvePaymentOp);
        }

        let paidPaymentOp = records.find(
          r => r.op[0] == "pay_funding_withdrawal_request"
            && r.op[1].funding_withdrawal_request_id == paymentId);
        if (paidPaymentOp) {
          paidPaymentOp.status = WITHDRAWAL_PAID;
          paymentRecords.push(paidPaymentOp);
        }

        let blocksPromises = paymentRecords.map(r => getBlock(r.block))
        return Promise.all(blocksPromises);
      })
      .then((blocks) => {
        for (let i = 0; i < paymentRecords.length; i++) {
          paymentRecords[i].blockInfo = blocks[i];
        }
        let trxPromises = paymentRecords.map(r => getTransaction(r.trx_id))
        return Promise.all(trxPromises);
      })
      .then((transactions) => { 
        for (let i = 0; i < paymentRecords.length; i++) {
          paymentRecords[i].trxInfo = transactions[i];
        }
        let trxHashPromises = transactions.map(tx => getTransactionHex(tx))
        return Promise.all(trxHashPromises);
      })
      .then((trxHashes) => {
        for (let i = 0; i < paymentRecords.length; i++) {
          paymentRecords[i].trxHash = trxHashes[i];
        }
      })
      .then(() => {
        let trxSigners = [];
        for (let i = 0; i < paymentRecords.length; i++) {
          let item = paymentRecords[i];
          if (i == 0) { // created
            trxSigners.push(item.op[1].requester);
          } else if (i == 1) { // certified
            trxSigners.push(item.op[1].certifier);
          } else if (i == 2) { // approved
            trxSigners.push(item.op[1].approver);
          } else if (i == 3) { // paid
            trxSigners.push(item.op[1].approver);
          }
        }
        return getEnrichedProfiles(trxSigners)
      })
      .then((profiles) => {
        for (let i = 0; i < paymentRecords.length; i++) {
          paymentRecords[i].trxSigner = profiles[i];
        }
        commit('SET_ORGANIZATION_HISTORY_RECORDS_LIST', paymentRecords);
      })
      .catch(err => { console.log(err) })
      .finally(() => {
        if (notify) notify();
      });
  }
  
}

// mutations
const mutations = {

  ['SET_PAYMENT_DETAILS_LOADING_STATE'](state, value) {
    state.isLoadingPaymentDetailsPage = value
  },

  ['SET_ORGANIZATION'](state, org) {
    Vue.set(state, 'organization', org);
  },

  ['SET_PAYMENT'](state, payment) {
    Vue.set(state, 'payment', payment);
  },

  ['SET_FUNDING_CONTRACT'](state, contract) {
    Vue.set(state, 'contract', contract);
  },

  ['SET_AWARD'](state, award) {
    Vue.set(state, 'award', award);
  },

  ['SET_ORGANIZATION_HISTORY_RECORDS_LIST'](state, historyRecords) {
    Vue.set(state, 'historyRecords', historyRecords);
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