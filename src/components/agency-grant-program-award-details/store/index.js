import _ from 'lodash';
import deipRpc from '@deip/rpc-client';
import Vue from 'vue';
import { AWARD_STATUS, AWARD_WITHDRAWAL_REQUEST_STATUS } from '@/variables';
import { ResearchGroupService } from '@deip/research-group-service';
import { GrantsService } from '@deip/grants-service';
import { UsersService } from '@deip/users-service';
import { BlockchainService } from '@deip/blockchain-service';
import { ResearchService } from '@deip/research-service';

const usersService = UsersService.getInstance();
const researchGroupService = ResearchGroupService.getInstance();
const grantsService = GrantsService.getInstance();
const blockchainService = BlockchainService.getInstance();
const researchService = ResearchService.getInstance();

const state = {
  isLoadingAwardDetailsPage: false,
  organization: undefined,
  award: undefined,
  awardee: undefined,
  foa: undefined,
  foaOrganization: undefined,
  awardPaymentRequestsList: [],
  awardeeUsersList: []
}

// getters
const getters = {
  isLoadingAwardDetailsPage: (state) => state.isLoadingAwardDetailsPage,
  organization: (state) => state.organization,
  foa: (state) => {
    return {
      ...state.foa,
      organization: state.foaOrganization
    }
  },
  award: (state) => state.award,

  awardee: (state) => {
    let award = state.award;
    let awardee = { ...state.awardee, isSubawardee: state.awardee.source != "" };
    let parentAwardee = awardee.isSubawardee ? award.awardees.find(a => a.awardee == awardee.source) : null;
    let foa = state.foa;

    let subawardees = grantsService.findAwardSubawardees(awardee, award.awardees);

    let withdrawals = state.awardPaymentRequestsList.filter(w => w.award_number == awardee.award_number && w.subaward_number == awardee.subaward_number);
    let subWithdrawals = subawardees.reduce((acc, sa) => {
      let withdrawals = state.awardPaymentRequestsList.filter(w => w.award_number == sa.award_number && w.subaward_number == sa.subaward_number);
      return [...acc, ...withdrawals];
    }, []);
    

    let piAmount = blockchainService.fromAssetsToFloat(awardee.total_amount);

    let requestedPiAmount = withdrawals
      .map(w => blockchainService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    let pendingPiAmount = withdrawals
      .filter(w =>
        w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING ||
        w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED ||
        w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED)
      .map(w => blockchainService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    let withdrawnPiAmount = withdrawals
      .filter(w =>
        w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PAID)
      .map(w => blockchainService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    let remainingPiAmount = blockchainService.fromAssetsToFloat(awardee.total_amount) - blockchainService.fromAssetsToFloat(awardee.total_expenses);


    let subawardeesAmount = subawardees
      .map(sa => blockchainService.fromAssetsToFloat(sa.total_amount))
      .reduce((sum, amount) => sum + amount, 0);

    let requestedSubawardeesAmount = subWithdrawals
      .map(w => blockchainService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    let pendingSubawardeesAmount = subWithdrawals
      .filter(w =>
        w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING ||
        w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED ||
        w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED)
      .map(w => blockchainService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    let withdrawnSubawardeesAmount = subWithdrawals
      .filter(w =>
        w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PAID)
      .map(w => blockchainService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    let remainingSubawardeesAmount = subawardees
      .map(sa => { return blockchainService.fromAssetsToFloat(sa.total_amount) - blockchainService.fromAssetsToFloat(sa.total_expenses) })
      .reduce((sum, amount) => sum + amount, 0);


    let universityOverheadAmount = awardee.isSubawardee ? 0 : blockchainService.fromAssetsToFloat(award.university_fee);

    let totalAmount = awardee.isSubawarde
      ? piAmount + subawardeesAmount
      : piAmount + subawardeesAmount + universityOverheadAmount;

    let requestedAmount = requestedPiAmount + requestedSubawardeesAmount;
    let pendingAmount = pendingPiAmount + pendingSubawardeesAmount;
    let withdrawnAmount = withdrawnPiAmount + withdrawnSubawardeesAmount;
    let remainingAmount = totalAmount - withdrawnPiAmount - withdrawnSubawardeesAmount - universityOverheadAmount;

    let reciever = state.awardeeUsersList.find(user => user.account.name == awardee.awardee);
    let pi = reciever; // PI is the user whose award we are browsing currently

    let research = state.awardeeResearchList.find(r => r.id == awardee.research_id);
    let organization = state.awardeeResearchGroupsList.find(rg => rg.id == research.research_group_id);

    return {
      ...awardee,
      parentAwardee,

      totalAmount,
      universityOverheadAmount,

      piAmount,
      requestedPiAmount,
      pendingPiAmount,
      withdrawnPiAmount,
      remainingPiAmount,

      subawardeesAmount,
      requestedSubawardeesAmount,
      pendingSubawardeesAmount,
      withdrawnSubawardeesAmount,
      remainingSubawardeesAmount,

      requestedAmount,
      pendingAmount,
      withdrawnAmount,
      remainingAmount,

      from: foa.open_date,
      to: foa.close_date,
      organization,
      pi
    }
  },

  subawardees: (state, getters) => {
    let award = state.award;
    let awardee = state.awardee;
    let subawards = award.awardees.filter(a => a.source == awardee.awardee);
    let foa = state.foa;

    return subawards.map(subawardee => {

      let nextSubawardees = grantsService.findAwardSubawardees(subawardee, award.awardees);

      let subawardeeWithdrawals = state.awardPaymentRequestsList.filter(w => w.award_number == subawardee.award_number && w.subaward_number == subawardee.subaward_number);
      let nextSubawardeesWithdrawals = nextSubawardees.reduce((acc, sa) => {
        let withdrawals = state.awardPaymentRequestsList.filter(w => w.award_number == sa.award_number && w.subaward_number == sa.subaward_number);
        return [...acc, ...withdrawals];
      }, []);


      let subawardeeAmount = blockchainService.fromAssetsToFloat(subawardee.total_amount);

      let requestedSubawardeeAmount = subawardeeWithdrawals
        .map(w => blockchainService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      let pendingSubawardeeAmount = subawardeeWithdrawals
        .filter(w =>
          w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING ||
          w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED ||
          w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED)
        .map(w => blockchainService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);
      
      let withdrawnSubawardeeAmount = subawardeeWithdrawals
        .filter(w =>
          w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PAID)
        .map(w => blockchainService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      let remainingSubawardeeAmount = blockchainService.fromAssetsToFloat(subawardee.total_amount) - blockchainService.fromAssetsToFloat(subawardee.total_expenses);


      let nextSubawardeesAmount = nextSubawardees
        .map(sa => blockchainService.fromAssetsToFloat(sa.total_amount))
        .reduce((sum, amount) => sum + amount, 0);

      let requestedNextSubawardeesAmount = nextSubawardeesWithdrawals
        .map(w => blockchainService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      let pendingNextSubawardeesAmount = nextSubawardeesWithdrawals
        .filter(w =>
          w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING ||
          w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED ||
          w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED)
        .map(w => blockchainService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      let withdrawnNextSubawardeesAmount = nextSubawardeesWithdrawals
        .filter(w =>
          w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PAID)
        .map(w => blockchainService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      let remainingNextSubawardeesAmount = nextSubawardees
        .map(sa => { return blockchainService.fromAssetsToFloat(sa.total_amount) - blockchainService.fromAssetsToFloat(sa.total_expenses) })
        .reduce((sum, amount) => sum + amount, 0);


      let totalSubawardeeAmount = subawardeeAmount + nextSubawardeesAmount
      let totalSubawardeeRequestedAmount = requestedSubawardeeAmount + requestedNextSubawardeesAmount;
      let totalSubawardeePendingAmount = pendingSubawardeeAmount + pendingNextSubawardeesAmount;
      let totalSubawardeeWithdrawnAmount = withdrawnSubawardeeAmount + withdrawnNextSubawardeesAmount;
      let totalSubawardeeRemainingAmount = remainingSubawardeeAmount + remainingNextSubawardeesAmount;


      let research = state.awardeeResearchList.find(r => r.id == subawardee.research_id);
      let organization = state.awardeeResearchGroupsList.find(rg => rg.id == research.research_group_id);

      let reciever = state.awardeeUsersList.find(user => user.account.name == subawardee.awardee);

      return {
        award,
        subawardee,

        totalSubawardeeAmount,
        totalSubawardeeRequestedAmount,
        totalSubawardeePendingAmount,
        totalSubawardeeWithdrawnAmount,
        totalSubawardeeRemainingAmount,

        from: foa.open_date,
        to: foa.close_date,

        organization,
        research,
        reciever
      }

    });
  },

  payments: state => {

    let award = state.award;
    let awardee = state.awardee;
    let subawardees = grantsService.findAwardSubawardees(awardee, award.awardees);

    return state.awardPaymentRequestsList
      .filter(p => [awardee, ...subawardees].some(a => p.award_number == a.award_number && p.subaward_number == a.subaward_number))
      .map((withdrawal, idx) => {
        let withdrawalAwardee = [awardee, ...subawardees].find(a => a.award_number == withdrawal.award_number && a.subaward_number == withdrawal.subaward_number);
        withdrawalAwardee.isSubawardee = withdrawalAwardee.source != "";

        let requester = state.awardeeUsersList.find(user => user.account.name == withdrawal.requester);
        let pi = state.awardeeUsersList.find(user => user.account.name == awardee.awardee); // PI is the user whose award we are browsing currently

        let research = state.awardeeResearchList.find(r => r.id == withdrawalAwardee.research_id);
        let organization = state.awardeeResearchGroupsList.find(rg => rg.id == research.research_group_id);

        return {
          id: withdrawal.id,
          paymentNumber: withdrawal.payment_number,
          awardNumber: withdrawal.award_number,
          subawardNumber: withdrawalAwardee.isSubawardee ? withdrawal.subaward_number : undefined, // do not send subaward number for top award
          amount: blockchainService.fromAssetsToFloat(withdrawal.amount),
          status: withdrawal.status,
          awardee: { ...withdrawalAwardee, isNextSubawardee: awardee.subaward_number != withdrawalAwardee.subaward_number },
          attachment: withdrawal.attachment,
          timestamp: withdrawal.time,
          organization,
          pi,
          requester
        }
      })
  },

  isAwardPending: (state, getters) => state.award.status == AWARD_STATUS.PENDING,
  isAwardApproved: (state, getters) => state.award.status == AWARD_STATUS.APPROVED,
  isAwardCanceled: (state, getters) => state.award.status == AWARD_STATUS.REJECTED,

  isAwardAvailableToApprove: (state, getters) => {
    let foaSupplyAmount = blockchainService.fromAssetsToFloat(state.foa.current_supply);
    let awardAmount = blockchainService.fromAssetsToFloat(state.award.amount);
    return foaSupplyAmount >= awardAmount && getters.isAwardPending;
  },
}

// actions
const actions = {

  loadAwardDetailsPage({ commit, dispatch, state }, { awardNumber, subawardNumber }) {
    commit('SET_AWARD_DETAILS_LOADING_STATE', true);

    const awardsLoad = new Promise((resolve, reject) => {
      dispatch('loadAwardDetails', { awardNumber, subawardNumber, notify: resolve });
    });

    return Promise.all([awardsLoad])
      .finally(() => {
        commit('SET_AWARD_DETAILS_LOADING_STATE', false);
      });
  },

  loadAwardDetails({ commit, dispatch, state }, { awardNumber, subawardNumber, notify }) {
    return grantsService.getAwardByNumber(awardNumber)
      .then((award) => {
        commit('SET_AWARD', award);
        let awardee = award.awardees.find(a => a.award_number == awardNumber && a.subaward_number == subawardNumber);
        commit('SET_AWARDEE', awardee);

        return grantsService.getFundingOpportunityAnnouncementByNumber(award.funding_opportunity_number);
      })
      .then((foa) => { 
        commit('SET_FUNDING_OPPORTUNITY', foa);

        return researchGroupService.getResearchGroupById(foa.organization_id);
      })
      .then((foaOrganization) => {
        commit('SET_FUNDING_OPPORTUNITY_ORGANIZATION', foaOrganization);

        return grantsService.getAwardWithdrawalRequestsByAward(awardNumber);
      })
      .then((paymentRequests) => { 
        commit('SET_AWARD_PAYMENT_REQUESTS_LIST', paymentRequests);

        return usersService.getEnrichedProfiles(state.award.awardees
          .map(r => r.awardee)
          .reduce((acc, awardee) => {
            return acc.some(a => a === awardee) ? acc : [awardee, ...acc];
          }, []));
      })
      .then((awardeeUsers) => {
        commit('SET_AWARDEE_USERS_LIST', awardeeUsers);
        return Promise.all(state.award.awardees.map(r => r.research_id)
          .reduce((acc, researchId) => {
            return acc.some(rId => rId === researchId) ? acc : [researchId, ...acc];
          }, [])
          .map(rId => researchService.getResearchWithOffchain(rId)));
      })
      .then((researchList) => {
        commit('SET_AWARDEE_RESEARCH_LIST', researchList);
        return Promise.all(researchList.map(r => r.research_group_id)
          .reduce((acc, researchGroupId) => {
            return acc.some(rgId => rgId === researchGroupId) ? acc : [researchGroupId, ...acc];
          }, [])
          .map(rgId => researchGroupService.getResearchGroupById(rgId)));
      })
      .then((researchGroups) => {
        commit('SET_AWARDEE_RESEARCH_GROUPS_LIST', researchGroups);
      })
      .catch(err => { console.log(err) })
      .finally(() => {
        if (notify) notify();
      });
  },


}

// mutations
const mutations = {

  ['SET_AWARD_DETAILS_LOADING_STATE'](state, value) {
    state.isLoadingAwardDetailsPage = value
  },

  ['SET_FUNDING_OPPORTUNITY'](state, foa) {
    Vue.set(state, 'foa', foa);
  },

  ['SET_FUNDING_OPPORTUNITY_ORGANIZATION'](state, foaOrganization) {
    Vue.set(state, 'foaOrganization', foaOrganization);
  },

  ['SET_AWARD'](state, award) {
    Vue.set(state, 'award', award);
  },

  ['SET_AWARDEE'](state, awardee) {
    Vue.set(state, 'awardee', awardee);
  },

  ['SET_AWARD_PAYMENT_REQUESTS_LIST'](state, paymentRequests) {
    Vue.set(state, 'awardPaymentRequestsList', paymentRequests);
  },

  ['SET_AWARDEE_USERS_LIST'](state, awardeeUsers) {
    Vue.set(state, 'awardeeUsersList', awardeeUsers)
  },

  ['SET_AWARDEE_RESEARCH_LIST'](state, researches) {
    Vue.set(state, 'awardeeResearchList', researches)
  },

  ['SET_AWARDEE_RESEARCH_GROUPS_LIST'](state, researchGroups) {
    Vue.set(state, 'awardeeResearchGroupsList', researchGroups)
  }
}

const namespaced = true;

export const agencyGrantProgramAwardDetailsStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}