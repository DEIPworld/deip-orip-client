import deipRpc from '@deip/rpc-client';
import Vue from 'vue';
import moment from 'moment';
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
  currentOrganization: null,
  tokenInfo: null,
  isLoadingOrganizationDashboardPage: undefined,

  awardsFoaList: [],
  awardsList: [],
  awardeesList: [],
  awardeeUsersList: [],
  awardsPaymentRequestsList: [],
  awardeeResearchList: [],
  awardeeResearchGroupsList: []
}

// getters
const getters = {
  isLoadingOrganizationDashboardPage: state => state.isLoadingOrganizationDashboardPage,
  currentOrganization: state => state.currentOrganization,
  tokenInfo: state => state.tokenInfo,
  awards: (state) => {

    return state.awardeesList.map((a, idx) => {
      let award = state.awardsList.find(award => award.award_number == a.award_number);
      let awardee = { ...a, isSubawardee: a.source != "" };
      let subawardees = grantsService.findAwardSubawardees(awardee, state.awardeesList);
      
      let withdrawals = state.awardsPaymentRequestsList.filter(w => w.award_number == awardee.award_number && w.subaward_number == awardee.subaward_number);
      let subWithdrawals = subawardees.reduce((acc, sa) => {
        let withdrawals = state.awardsPaymentRequestsList.filter(w => w.award_number == sa.award_number && w.subaward_number == sa.subaward_number);
        return [ ...acc, ...withdrawals ];
      }, []);

      let totalAmount = awardee.isSubawardee
        ? blockchainService.fromAssetsToFloat(awardee.total_amount) + subawardees.reduce((acc, a) => acc + blockchainService.fromAssetsToFloat(a.total_amount), 0)
        : blockchainService.fromAssetsToFloat(award.amount);

      let universityOverheadAmount = awardee.isSubawardee ? 0 : blockchainService.fromAssetsToFloat(award.university_fee);
      
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

      let requestedAmount = requestedPiAmount + requestedSubawardeesAmount;
      let pendingAmount = pendingPiAmount + pendingSubawardeesAmount;
      let withdrawnAmount = withdrawnPiAmount + withdrawnSubawardeesAmount;

      let remainingAmount = totalAmount - withdrawnPiAmount - withdrawnSubawardeesAmount - universityOverheadAmount;

      let reciever = state.awardeeUsersList.find(user => user.account.name == awardee.awardee);
      let topPi = state.awardeeUsersList.find(user => user.account.name == award.awardee); // top PI is the top level award receiver

      let research = state.awardeeResearchList.find(r => r.id == awardee.research_id);
      let organization = state.awardeeResearchGroupsList.find(rg => rg.id == research.research_group_id);
      let foa = state.awardsFoaList.find(foa => foa.funding_opportunity_number == award.funding_opportunity_number);

      return {
        award,
        awardee,

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
        foa,
        organization,
        research,
        topPi,
        reciever
      }

    });
  },


  payments: state => {
    return state.awardsPaymentRequestsList.map((withdrawal, idx) => {
      let award = state.awardsList.find(a => a.award_number == withdrawal.award_number);
      let a = state.awardeesList.find(a => a.award_number == withdrawal.award_number && a.subaward_number == withdrawal.subaward_number);
      let awardee = { ...a, isSubawardee: a.source != "" };
      // let parentAwardee = awardee.isSubawardee ? award.awardees.find(a => a.awardee == awardee.source) : null;
      let parentAwardees = grantsService.findParentAwardees(awardee, state.awardeesList);
      let research = state.awardeeResearchList.find(r => r.id == awardee.research_id);
      let parentResearches = parentAwardees
        .reduce((acc, a) => {
          return [...acc, state.awardeeResearchList.find(r => r.id == a.research_id)]
        }, []);

      let organization = state.awardeeResearchGroupsList.find(rg => rg.id == research.research_group_id);
      let parentOrganizations = state.awardeeResearchGroupsList.filter(rg => parentResearches.some(r => r.research_group_id == rg.id));
      let requester = state.awardeeUsersList.find(user => user.account.name == withdrawal.requester);
      
      let topPi = state.awardeeUsersList.find(user => user.account.name == award.awardee); // top PI is the top level award receiver
      let foa = state.awardsFoaList.find(foa => foa.funding_opportunity_number == award.funding_opportunity_number);

      return {
        id: withdrawal.id,
        paymentNumber: withdrawal.payment_number,
        awardNumber: withdrawal.award_number,
        subawardNumber: awardee.isSubawardee ? withdrawal.subaward_number : undefined, // do not send subaward number for top award
        amount: blockchainService.fromAssetsToFloat(withdrawal.amount),
        status: withdrawal.status,
        attachment: withdrawal.attachment,
        timestamp: withdrawal.time,
        requester,
        organization,
        topPi,
        parentOrganizations,
        foa,
        award,
        awardee
      }

    });
  }
}

// actions
const actions = {

  loadAgencyAwardsDashboardPage({ commit, dispatch, state }, { permlink }) {
    commit('SET_ORGANIZATION_DASHBOARD_LOADING_STATE', true);

    return researchGroupService.getResearchGroupByPermlink(permlink)
      .then((currentOrganization) => {
        commit('SET_CURRENT_ORGANIZATION', currentOrganization);

        const awardsLoad = new Promise((resolve, reject) => {
          dispatch('loadAwards', { organizationId: state.currentOrganization.id, notify: resolve });
        });

        const tokenStatsLoad = new Promise((resolve, reject) => {
          dispatch('loadTokenStats', { organizationId: state.currentOrganization.id,  notify: resolve });
        });

        return Promise.all([awardsLoad, tokenStatsLoad]);
      })
      .finally(() => {
        commit('SET_ORGANIZATION_DASHBOARD_LOADING_STATE', false);
      });
  },

  loadAwards({ commit, dispatch, state }, { organizationId, notify }) {
    // TODO: load awards for the current organization only
    return grantsService.getFundingOpportunityAnnouncementsListing(1, 100)
      .then((awardsFoaList) => {
        commit('SET_AWARDS_FUNDING_OPPORTUNITIES_LIST', awardsFoaList);
        
        return Promise.all(awardsFoaList.map((foa) => grantsService.getAwardsByFundingOpportunity(foa.funding_opportunity_number)));
      })
      .then((awards) => {
        let flatten = [].concat.apply([], awards);
        commit('SET_AWARDS_LIST', flatten);

        return Promise.all(flatten.map((award) => grantsService.getAwardWithdrawalRequestsByAward(award.award_number)));
      })
      .then((paymentRequests) => {
        let flatten = [].concat.apply([], paymentRequests);
        commit('SET_PAYMENT_REQUESTS_LIST', flatten);

        return usersService.getEnrichedProfiles(state.awardeesList
          .map(r => r.awardee)
          .reduce((acc, awardee) => {
            return acc.some(a => a === awardee) ? acc : [awardee, ...acc];
          }, []));
      })
      .then((awardeeUsers) => {
        commit('SET_AWARDEE_USERS_LIST', awardeeUsers);

        return Promise.all(state.awardeesList.map(r => r.research_id)
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

  loadTokenStats({ commit, dispatch, state }, { organizationId, notify }) {
    // TODO: introduce specific token statistic object
    const allOrganizationFundingOpportunities = [];
    const allOrganizationFundingOpportunitiesAwards = [];

    return grantsService.getFundingOpportunityAnnouncementsByOrganization(organizationId)
      .then((list) => {
        allOrganizationFundingOpportunities.push(...list);
        return Promise.all(allOrganizationFundingOpportunities.map(foa => grantsService.getAwardsByFundingOpportunity(foa.funding_opportunity_number)));
      })
      .then((list) => {
        allOrganizationFundingOpportunitiesAwards.push(...[].concat.apply([], list));
        
        let totalIssuedTokensAmount = allOrganizationFundingOpportunities.reduce((acc, foa) => {
          return acc + blockchainService.fromAssetsToFloat(foa.amount);
        }, 0);

        let totalAwardedTokensAmount = allOrganizationFundingOpportunitiesAwards.reduce((acc, award) => {
          return award.status == AWARD_STATUS.APPROVED ? acc + blockchainService.fromAssetsToFloat(award.amount) : acc;
        }, 0);

        let totalAvailableTokensAmount = totalIssuedTokensAmount - totalAwardedTokensAmount;

        let totalWithdrawnTokensAmount = allOrganizationFundingOpportunitiesAwards.reduce((acc, award) => {
          return award.status == AWARD_STATUS.APPROVED ? acc + award.awardees.reduce((acc, awardee) => acc + blockchainService.fromAssetsToFloat(awardee.total_expenses), 0) : acc;
        }, 0);

        let totalCirculatingTokensAmount = totalIssuedTokensAmount - totalWithdrawnTokensAmount;

        commit('SET_AWARDS_TOKEN_STATISTIC', {
          totalIssuedTokensAmount,
          totalCirculatingTokensAmount,
          totalAvailableTokensAmount,
          totalAwardedTokensAmount,
          totalWithdrawnTokensAmount
        });
      })
      .catch(err => { console.log(err) })
      .finally(() => {
        if (notify) notify();
      });
  },
}

// mutations
const mutations = {

  ['SET_ORGANIZATION_DASHBOARD_LOADING_STATE'](state, isLoading) {
    Vue.set(state, 'isLoadingOrganizationDashboardPage', isLoading);
  },

  ['SET_CURRENT_ORGANIZATION'](state, currentOrganization) {
    Vue.set(state, 'currentOrganization', currentOrganization);
  },

  ['SET_AWARDS_FUNDING_OPPORTUNITIES_LIST'](state, awardsFoaList) {
    Vue.set(state, 'awardsFoaList', awardsFoaList)
  },

  ['SET_AWARDS_LIST'](state, awardsList) {
    Vue.set(state, 'awardsList', awardsList);
    Vue.set(state, 'awardeesList', [].concat.apply([], awardsList.map(a => a.awardees)));
  },

  ['SET_PAYMENT_REQUESTS_LIST'](state, paymentRequestsList) {
    Vue.set(state, 'awardsPaymentRequestsList', paymentRequestsList)
  },

  ['SET_AWARDEE_USERS_LIST'](state, awardeeUsers) {
    Vue.set(state, 'awardeeUsersList', awardeeUsers)
  },

  ['SET_AWARDEE_RESEARCH_LIST'](state, researches) {
    Vue.set(state, 'awardeeResearchList', researches)
  },

  ['SET_AWARDEE_RESEARCH_GROUPS_LIST'](state, researchGroups) {
    Vue.set(state, 'awardeeResearchGroupsList', researchGroups)
  },

  ['SET_AWARDS_TOKEN_STATISTIC'](state, stats) {
    Vue.set(state, 'tokenInfo', stats)
  }
  
}

const namespaced = true;

export const agencyGrantProgramAwardsDashboardStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
