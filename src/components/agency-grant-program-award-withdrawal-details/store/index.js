import deipRpc from '@deip/rpc-client';
import Vue from 'vue';

import { AWARD_STATUS, AWARD_WITHDRAWAL_REQUEST_STATUS } from '@/variables';
import { BlockchainService } from '@deip/blockchain-service';
import { GrantsService } from '@deip/grants-service';
import { UsersService } from '@deip/users-service';
import { ResearchGroupService } from '@deip/research-group-service';
import { ResearchService } from '@deip/research-service';

const blockchainService = BlockchainService.getInstance();
const grantsService = GrantsService.getInstance();
const usersService = UsersService.getInstance();
const researchGroupService = ResearchGroupService.getInstance();
const researchService = ResearchService.getInstance();


const state = {
  isLoadingAwardDetailsPage: false,
  withdrawal: undefined,
  award: undefined,
  awardPI: undefined,
  awardee: undefined,
  research: undefined,
  awardeeOrganization: undefined,
  foa: undefined,
  foaOrganization: undefined,
  universityOrganization: undefined,
  treasuryOrganization: undefined,
  withdrawalHistoryRecords: [],
  withdrawalHistoryRecordsBlocks: [],
  withdrawalHistoryRecordsTransactions: [],
  withdrawalSigners: []

  // witnesses: []
}

// getters
const getters = {
  isLoadingPaymentDetailsPage: (state) => state.isLoadingPaymentDetailsPage,
  
  foa: (state) => {
    return {
      ...state.foa,
      organization: state.foaOrganization
    }
  },

  awardee: (state) => {
    return {
      ...state.awardee,
      isSubawardee: state.awardee.source != "",
      organization: state.awardeeOrganization,
      university: state.universityOrganization,
      research: state.research
    }
  },

  treasury: (state) => {
    return {
      organization: state.treasuryOrganization
    }
  },

  withdrawal: (state, getters) => {
    let withdrawal = state.withdrawal;

    let pi = state.awardPI;
    let requester = state.withdrawalSigners.find((user) => user.account.name == state.withdrawal.requester);

    return {
      id: withdrawal.id,
      paymentNumber: withdrawal.payment_number,
      awardNumber: state.awardee.award_number,
      subawardNumber: state.awardee.subaward_number,
      amount: blockchainService.fromAssetsToFloat(withdrawal.amount),
      status: withdrawal.status,
      description: withdrawal.description,
      pi,
      requester,
      timestamp: withdrawal.time,
      attachment: withdrawal.withdrawalRef
    }
  },

  withdrawalHistoryRecords: (state, getters) => {

    return state.withdrawalHistoryRecords.map((record) => {
      let trxSigner = state.withdrawalSigners.find((user) => {
        if (record.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING) {
          return record.requester == user.account.name;
        } else if (record.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED) {
          return record.certifier == user.account.name;
        } else if (record.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED) {
          return record.approver == user.account.name;
        } else if (record.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PAID) {
          return record.payer == user.account.name;
        } else if (record.status == AWARD_WITHDRAWAL_REQUEST_STATUS.REJECTED) {
          return record.rejector == user.account.name;
        }
      });

      let trxOrg;
      if (record.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING) {
        trxOrg = getters.awardee.organization;
      } else if (record.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED) {
        trxOrg = getters.awardee.university;
      } else if (record.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED) {
        trxOrg = getters.foa.organization;
      } else if (record.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PAID) {
        trxOrg = getters.treasury.organization;
      } else if (record.status == AWARD_WITHDRAWAL_REQUEST_STATUS.REJECTED) {
        trxOrg = record.certifier ? getters.foa.organization : getters.awardee.university;
      }
    
      let trxInfo = state.withdrawalHistoryRecordsTransactions.find((tx) => {
        return tx.block_num == record.block;
      });

      let blockInfo = state.withdrawalHistoryRecordsBlocks.find((block) => {
        return block.block_num == record.block;
      });

      return {
        ...record,
        trxSigner,
        trxInfo,
        blockInfo,
        trxOrg
      }
    });
  },
  // witnesses: (state) => state.witnesses
}

// actions
const actions = {
  
  loadWithdrawalDetailsPage({ commit, dispatch, state }, { awardNumber, subawardNumber, paymentNumber }) {
    commit('SET_AWARD_WITHDRAWAL_DETAILS_LOADING_STATE', true);
    
    const withdrawalLoad = new Promise((resolve, reject) => {
      dispatch('loadWithdrawalDetails', { awardNumber, subawardNumber, paymentNumber, notify: resolve });
    });

    const withdrawalHistoryLoad = new Promise((resolve, reject) => {
      dispatch('loadWithdrawalHistoryRecords', { awardNumber, subawardNumber, paymentNumber, notify: resolve });
    });

    // const witnessesLoad = new Promise((resolve, reject) => {
    //   dispatch('loadWitnesses', { notify: resolve });
    // });

    return Promise.all([withdrawalLoad, withdrawalHistoryLoad])
      .catch(err => { console.log(err) })
      .finally(() => {
        commit('SET_AWARD_WITHDRAWAL_DETAILS_LOADING_STATE', false);
      });
  },

  loadWithdrawalDetails({ commit, dispatch, state }, { awardNumber, subawardNumber, paymentNumber, notify }) {
    return grantsService.getAwardWithdrawalRequestWithOffchain(awardNumber, paymentNumber)
      .then((withdrawal) => {
        commit('SET_AWARD_WITHDRAWAL', withdrawal);
        return grantsService.getAwardByNumber(awardNumber);
      })
      .then((award) => {
        commit('SET_AWARD', award);
        let awardee = award.awardees.find(a => a.award_number == awardNumber && a.subaward_number == subawardNumber);
        commit('SET_AWARDEE', awardee);
        return usersService.getEnrichedProfiles([awardee.source != "" ? awardee.source : awardee.awardee]);
      })
      .then(([pi]) => {
        commit('SET_AWARD_PI', pi);
        return grantsService.getFundingOpportunityAnnouncementByNumber(state.award.funding_opportunity_number);
      })
      .then((foa) => {
        commit('SET_FUNDING_OPPORTUNITY', foa);
        return researchGroupService.getResearchGroupById(state.foa.organization_id);
      })
      .then((foaOrganization) => {
        commit('SET_FUNDING_OPPORTUNITY_ORGANIZATION', foaOrganization);
        return researchService.getResearchWithOffchain(state.awardee.research_id);
      })
      .then((research) => {
        commit('SET_AWARDEE_RESEARCH', research);
        return researchGroupService.getResearchGroupById(state.research.research_group_id);
      })
      .then((researchGroup) => {
        commit('SET_AWARDEE_ORGANIZATION', researchGroup);
        return researchGroupService.getResearchGroupById(state.award.university_id);
      })
      .then((researchGroup) => {
        commit('SET_UNIVERSITY_ORGANIZATION', researchGroup);
        return researchGroupService.getResearchGroupById(state.foa.treasury_id);
      })
      .then((researchGroup) => { 
        commit('SET_TREASURY_ORGANIZATION', researchGroup);
      })
      .catch(err => { console.log(err) })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadWithdrawalHistoryRecords({ commit, dispatch, state }, { awardNumber, subawardNumber, paymentNumber, notify }) {
    const transactions = [];
    return grantsService.getWithdrawalRequestHistoryByAwardAndPaymentNumber(awardNumber, paymentNumber)
      .then((withdrawalHistoryRecords) => {
        commit('SET_AWARD_WITHDRAWAL_HISTORY_RECORDS_LIST', withdrawalHistoryRecords);
        return Promise.all(state.withdrawalHistoryRecords.map(r => blockchainService.getBlock(r.block)));
      })
      .then((blocks) => {
        commit('SET_AWARD_WITHDRAWAL_HISTORY_RECORDS_BLOCKS_LIST', blocks);
        return Promise.all(state.withdrawalHistoryRecords.map(r => blockchainService.getTransaction(r.trx_id)));
      })
      .then((items) => { 
        transactions.push(...items);
        return Promise.all(transactions.map(tx => blockchainService.getTransactionHex(tx)));
      })
      .then((trxHashes) => {
        commit('SET_AWARD_WITHDRAWAL_HISTORY_RECORDS_TRANSACTIONS_LIST', transactions.map((tx, i) => {
          return { ...tx, trxHash: trxHashes[i] };
        }));

        let trxSigners = [];
        for (let i = 0; i < state.withdrawalHistoryRecords.length; i++) {
          let record = state.withdrawalHistoryRecords[i];
          if (record.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING) {
            trxSigners.push(record.requester);
          } else if (record.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED) {
            trxSigners.push(record.certifier);
          } else if (record.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED) {
            trxSigners.push(record.approver);
          } else if (record.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PAID) {
            trxSigners.push(record.payer);
          } else if (record.status == AWARD_WITHDRAWAL_REQUEST_STATUS.REJECTED) {
            trxSigners.push(record.rejector);
          }
        }
        return usersService.getEnrichedProfiles(trxSigners);
      })
      .then((users) => {
        commit('SET_AWARD_WITHDRAWAL_SIGNERS_LIST', users);
      })
      .catch(err => { console.log(err) })
      .finally(() => {
        if (notify) notify();
      });
    },

  // loadWitnesses({ commit, dispatch, state }, { notify }) {
  //   return deipRpc.api.getActiveWitnessesAsync()
  //     .then((items) => {
  //       let witnesses = items.filter(w => w != "");
  //       return Promise.all(witnesses.map(w => deipRpc.api.getWitnessByAccountAsync(w)));
  //     })
  //     .then(witnesses => {
  //       commit('SET_WITNESSES_LIST', witnesses);
  //     })
  //     .catch(err => { console.log(err) })
  //     .finally(() => {
  //       if (notify) notify();
  //     });
  // }
  
}

// mutations
const mutations = {

  ['SET_AWARD_WITHDRAWAL_DETAILS_LOADING_STATE'](state, value) {
    state.isLoadingPaymentDetailsPage = value
  },

  ['SET_AWARD_WITHDRAWAL'](state, payment) {
    Vue.set(state, 'withdrawal', payment);
  },

  ['SET_AWARD'](state, award) {
    Vue.set(state, 'award', award);
  },

  ['SET_AWARDEE'](state, awardee) {
    Vue.set(state, 'awardee', awardee);
  },

  ['SET_AWARDEE_RESEARCH'](state, research) {
    Vue.set(state, 'research', research);
  },

  ['SET_AWARDEE_ORGANIZATION'](state, organization) {
    Vue.set(state, 'awardeeOrganization', organization);
  },

  ['SET_UNIVERSITY_ORGANIZATION'](state, organization) {
    Vue.set(state, 'universityOrganization', organization);
  },

  ['SET_TREASURY_ORGANIZATION'](state, organization) {
    Vue.set(state, 'treasuryOrganization', organization);
  },

  ['SET_AWARD_WITHDRAWAL_HISTORY_RECORDS_LIST'](state, withdrawalHistoryRecords) {
    Vue.set(state, 'withdrawalHistoryRecords', withdrawalHistoryRecords);
  },

  ['SET_AWARD_WITHDRAWAL_HISTORY_RECORDS_BLOCKS_LIST'](state, withdrawalHistoryRecordsBlocks) {
    Vue.set(state, 'withdrawalHistoryRecordsBlocks', withdrawalHistoryRecordsBlocks);
  },

  ['SET_AWARD_WITHDRAWAL_HISTORY_RECORDS_TRANSACTIONS_LIST'](state, withdrawalHistoryRecordsTransactions) {
    Vue.set(state, 'withdrawalHistoryRecordsTransactions', withdrawalHistoryRecordsTransactions);
  },

  ['SET_AWARD_WITHDRAWAL_SIGNERS_LIST'](state, users) {
    Vue.set(state, 'withdrawalSigners', users);
  },

  ['SET_AWARD_PI'](state, user) {
    Vue.set(state, 'awardPI', user);
  },
  
  ['SET_FUNDING_OPPORTUNITY'](state, foa) {
    Vue.set(state, 'foa', foa);
  },

  ['SET_FUNDING_OPPORTUNITY_ORGANIZATION'](state, foa) {
    Vue.set(state, 'foaOrganization', foa);
  },

  ['SET_WITNESSES_LIST'](state, witnesses) {
    Vue.set(state, 'witnesses', witnesses);
  }

}

const namespaced = true;

export const agencyGrantProgramAwardWithdrawalDetailsStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}