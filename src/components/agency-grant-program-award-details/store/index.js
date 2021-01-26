import _ from 'lodash';
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
};

// getters
const getters = {
  isLoadingAwardDetailsPage: (state) => state.isLoadingAwardDetailsPage,
  organization: (state) => state.organization,
  foa: (state) => ({
    ...state.foa,
    organization: state.foaOrganization
  }),
  award: (state) => state.award,

  awardee: (state) => {
    const { award } = state;
    const awardee = { ...state.awardee, isSubawardee: state.awardee.source != '' };
    const parentAwardee = awardee.isSubawardee ? award.awardees.find((a) => a.awardee == awardee.source) : null;
    const { foa } = state;

    const subawardees = grantsService.findAwardSubawardees(awardee, award.awardees);

    const withdrawals = state.awardPaymentRequestsList.filter((w) => w.award_number == awardee.award_number && w.subaward_number == awardee.subaward_number);
    const subWithdrawals = subawardees.reduce((acc, sa) => {
      const withdrawals = state.awardPaymentRequestsList.filter((w) => w.award_number == sa.award_number && w.subaward_number == sa.subaward_number);
      return [...acc, ...withdrawals];
    }, []);

    const piAmount = blockchainService.fromAssetsToFloat(awardee.total_amount);

    const requestedPiAmount = withdrawals
      .map((w) => blockchainService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    const pendingPiAmount = withdrawals
      .filter((w) => w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING
        || w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED
        || w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED)
      .map((w) => blockchainService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    const withdrawnPiAmount = withdrawals
      .filter((w) => w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PAID)
      .map((w) => blockchainService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    const remainingPiAmount = blockchainService.fromAssetsToFloat(awardee.total_amount) - blockchainService.fromAssetsToFloat(awardee.total_expenses);

    const subawardeesAmount = subawardees
      .map((sa) => blockchainService.fromAssetsToFloat(sa.total_amount))
      .reduce((sum, amount) => sum + amount, 0);

    const requestedSubawardeesAmount = subWithdrawals
      .map((w) => blockchainService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    const pendingSubawardeesAmount = subWithdrawals
      .filter((w) => w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING
        || w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED
        || w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED)
      .map((w) => blockchainService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    const withdrawnSubawardeesAmount = subWithdrawals
      .filter((w) => w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PAID)
      .map((w) => blockchainService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    const remainingSubawardeesAmount = subawardees
      .map((sa) => blockchainService.fromAssetsToFloat(sa.total_amount) - blockchainService.fromAssetsToFloat(sa.total_expenses))
      .reduce((sum, amount) => sum + amount, 0);

    const universityOverheadAmount = awardee.isSubawardee ? 0 : blockchainService.fromAssetsToFloat(award.university_fee);

    const totalAmount = awardee.isSubawarde
      ? piAmount + subawardeesAmount
      : piAmount + subawardeesAmount + universityOverheadAmount;

    const requestedAmount = requestedPiAmount + requestedSubawardeesAmount;
    const pendingAmount = pendingPiAmount + pendingSubawardeesAmount;
    const withdrawnAmount = withdrawnPiAmount + withdrawnSubawardeesAmount;
    const remainingAmount = totalAmount - withdrawnPiAmount - withdrawnSubawardeesAmount - universityOverheadAmount;

    const reciever = state.awardeeUsersList.find((user) => user.account.name == awardee.awardee);
    const pi = reciever; // PI is the user whose award we are browsing currently

    const research = state.awardeeResearchList.find((r) => r.id == awardee.research_id);
    const organization = state.awardeeResearchGroupsList.find((rg) => rg.id == research.research_group_id);

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
    };
  },

  subawardees: (state, getters) => {
    const { award } = state;
    const { awardee } = state;
    const subawards = award.awardees.filter((a) => a.source == awardee.awardee);
    const { foa } = state;

    return subawards.map((subawardee) => {
      const nextSubawardees = grantsService.findAwardSubawardees(subawardee, award.awardees);

      const subawardeeWithdrawals = state.awardPaymentRequestsList.filter((w) => w.award_number == subawardee.award_number && w.subaward_number == subawardee.subaward_number);
      const nextSubawardeesWithdrawals = nextSubawardees.reduce((acc, sa) => {
        const withdrawals = state.awardPaymentRequestsList.filter((w) => w.award_number == sa.award_number && w.subaward_number == sa.subaward_number);
        return [...acc, ...withdrawals];
      }, []);

      const subawardeeAmount = blockchainService.fromAssetsToFloat(subawardee.total_amount);

      const requestedSubawardeeAmount = subawardeeWithdrawals
        .map((w) => blockchainService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      const pendingSubawardeeAmount = subawardeeWithdrawals
        .filter((w) => w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING
          || w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED
          || w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED)
        .map((w) => blockchainService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      const withdrawnSubawardeeAmount = subawardeeWithdrawals
        .filter((w) => w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PAID)
        .map((w) => blockchainService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      const remainingSubawardeeAmount = blockchainService.fromAssetsToFloat(subawardee.total_amount) - blockchainService.fromAssetsToFloat(subawardee.total_expenses);

      const nextSubawardeesAmount = nextSubawardees
        .map((sa) => blockchainService.fromAssetsToFloat(sa.total_amount))
        .reduce((sum, amount) => sum + amount, 0);

      const requestedNextSubawardeesAmount = nextSubawardeesWithdrawals
        .map((w) => blockchainService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      const pendingNextSubawardeesAmount = nextSubawardeesWithdrawals
        .filter((w) => w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING
          || w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED
          || w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED)
        .map((w) => blockchainService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      const withdrawnNextSubawardeesAmount = nextSubawardeesWithdrawals
        .filter((w) => w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PAID)
        .map((w) => blockchainService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      const remainingNextSubawardeesAmount = nextSubawardees
        .map((sa) => blockchainService.fromAssetsToFloat(sa.total_amount) - blockchainService.fromAssetsToFloat(sa.total_expenses))
        .reduce((sum, amount) => sum + amount, 0);

      const totalSubawardeeAmount = subawardeeAmount + nextSubawardeesAmount;
      const totalSubawardeeRequestedAmount = requestedSubawardeeAmount + requestedNextSubawardeesAmount;
      const totalSubawardeePendingAmount = pendingSubawardeeAmount + pendingNextSubawardeesAmount;
      const totalSubawardeeWithdrawnAmount = withdrawnSubawardeeAmount + withdrawnNextSubawardeesAmount;
      const totalSubawardeeRemainingAmount = remainingSubawardeeAmount + remainingNextSubawardeesAmount;

      const research = state.awardeeResearchList.find((r) => r.id == subawardee.research_id);
      const organization = state.awardeeResearchGroupsList.find((rg) => rg.id == research.research_group_id);

      const reciever = state.awardeeUsersList.find((user) => user.account.name == subawardee.awardee);

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
      };
    });
  },

  payments: (state) => {
    const { award } = state;
    const { awardee } = state;
    const subawardees = grantsService.findAwardSubawardees(awardee, award.awardees);

    return state.awardPaymentRequestsList
      .filter((p) => [awardee, ...subawardees].some((a) => p.award_number == a.award_number && p.subaward_number == a.subaward_number))
      .map((withdrawal, idx) => {
        const withdrawalAwardee = [awardee, ...subawardees].find((a) => a.award_number == withdrawal.award_number && a.subaward_number == withdrawal.subaward_number);
        withdrawalAwardee.isSubawardee = withdrawalAwardee.source != '';

        const requester = state.awardeeUsersList.find((user) => user.account.name == withdrawal.requester);
        const pi = state.awardeeUsersList.find((user) => user.account.name == awardee.awardee); // PI is the user whose award we are browsing currently

        const research = state.awardeeResearchList.find((r) => r.id == withdrawalAwardee.research_id);
        const organization = state.awardeeResearchGroupsList.find((rg) => rg.id == research.research_group_id);

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
        };
      });
  },

  isAwardPending: (state, getters) => state.award.status == AWARD_STATUS.PENDING,
  isAwardApproved: (state, getters) => state.award.status == AWARD_STATUS.APPROVED,
  isAwardCanceled: (state, getters) => state.award.status == AWARD_STATUS.REJECTED,

  isAwardAvailableToApprove: (state, getters) => {
    const foaSupplyAmount = blockchainService.fromAssetsToFloat(state.foa.current_supply);
    const awardAmount = blockchainService.fromAssetsToFloat(state.award.amount);
    return foaSupplyAmount >= awardAmount && getters.isAwardPending;
  }
};

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
        const awardee = award.awardees.find((a) => a.award_number == awardNumber && a.subaward_number == subawardNumber);
        commit('SET_AWARDEE', awardee);

        return grantsService.getFundingOpportunityAnnouncementByNumber(award.funding_opportunity_number);
      })
      .then((foa) => {
        commit('SET_FUNDING_OPPORTUNITY', foa);

        return researchGroupService.getResearchGroup(foa.organization_external_id);
      })
      .then((foaOrganization) => {
        commit('SET_FUNDING_OPPORTUNITY_ORGANIZATION', foaOrganization);

        return grantsService.getAwardWithdrawalRequestsByAward(awardNumber);
      })
      .then((paymentRequests) => {
        commit('SET_AWARD_PAYMENT_REQUESTS_LIST', paymentRequests);

        return usersService.getEnrichedProfiles(state.award.awardees
          .map((r) => r.awardee)
          .reduce((acc, awardee) => (acc.some((a) => a === awardee) ? acc : [awardee, ...acc]), []));
      })
      .then((awardeeUsers) => {
        commit('SET_AWARDEE_USERS_LIST', awardeeUsers);
        return Promise.all(state.award.awardees.map((r) => r.research_external_id)
          .reduce((acc, researchId) => (acc.some((rId) => rId === researchId) ? acc : [researchId, ...acc]), [])
          .map((rId) => researchService.getResearch(rId)));
      })
      .then((researchList) => {
        commit('SET_AWARDEE_RESEARCH_LIST', researchList);
        return Promise.all(researchList.map((r) => r.research_group.external_id)
          .reduce((acc, researchGroupId) => (acc.some((rgId) => rgId === researchGroupId) ? acc : [researchGroupId, ...acc]), [])
          .map((rgId) => researchGroupService.getResearchGroup(rgId)));
      })
      .then((researchGroups) => {
        commit('SET_AWARDEE_RESEARCH_GROUPS_LIST', researchGroups);
      })
      .catch((err) => { console.error(err); })
      .finally(() => {
        if (notify) notify();
      });
  }

};

// mutations
const mutations = {

  SET_AWARD_DETAILS_LOADING_STATE(state, value) {
    state.isLoadingAwardDetailsPage = value;
  },

  SET_FUNDING_OPPORTUNITY(state, foa) {
    state.foa = foa;
  },

  SET_FUNDING_OPPORTUNITY_ORGANIZATION(state, foaOrganization) {
    state.foaOrganization = foaOrganization;
  },

  SET_AWARD(state, award) {
    state.award = award;
  },

  SET_AWARDEE(state, awardee) {
    state.awardee = awardee;
  },

  SET_AWARD_PAYMENT_REQUESTS_LIST(state, paymentRequests) {
    state.awardPaymentRequestsList = paymentRequests;
  },

  SET_AWARDEE_USERS_LIST(state, awardeeUsers) {
    state.awardeeUsersList = awardeeUsers;
  },

  SET_AWARDEE_RESEARCH_LIST(state, researches) {
    state.awardeeResearchList = researches;
  },

  SET_AWARDEE_RESEARCH_GROUPS_LIST(state, researchGroups) {
    state.awardeeResearchGroupsList = researchGroups;
  }
};

const namespaced = true;

export const agencyGrantProgramAwardDetailsStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
