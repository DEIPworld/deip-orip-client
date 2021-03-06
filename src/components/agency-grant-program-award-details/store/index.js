import _ from 'lodash';
import { AWARD_STATUS, AWARD_WITHDRAWAL_REQUEST_STATUS } from '@/variables';
import { GrantsService } from '@deip/grants-service';
import { UserService } from '@deip/user-service';
import { ProjectService } from '@deip/project-service';
import { TeamService } from '@deip/team-service';

const teamService = TeamService.getInstance();
const userService = UserService.getInstance();
const grantsService = GrantsService.getInstance();
const projectService = ProjectService.getInstance();

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

    const piAmount = grantsService.fromAssetsToFloat(awardee.total_amount);

    const requestedPiAmount = withdrawals
      .map((w) => grantsService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    const pendingPiAmount = withdrawals
      .filter((w) => w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING
        || w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED
        || w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED)
      .map((w) => grantsService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    const withdrawnPiAmount = withdrawals
      .filter((w) => w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PAID)
      .map((w) => grantsService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    const remainingPiAmount = grantsService.fromAssetsToFloat(awardee.total_amount) - grantsService.fromAssetsToFloat(awardee.total_expenses);

    const subawardeesAmount = subawardees
      .map((sa) => grantsService.fromAssetsToFloat(sa.total_amount))
      .reduce((sum, amount) => sum + amount, 0);

    const requestedSubawardeesAmount = subWithdrawals
      .map((w) => grantsService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    const pendingSubawardeesAmount = subWithdrawals
      .filter((w) => w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING
        || w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED
        || w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED)
      .map((w) => grantsService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    const withdrawnSubawardeesAmount = subWithdrawals
      .filter((w) => w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PAID)
      .map((w) => grantsService.fromAssetsToFloat(w.amount))
      .reduce((sum, amount) => sum + amount, 0);

    const remainingSubawardeesAmount = subawardees
      .map((sa) => grantsService.fromAssetsToFloat(sa.total_amount) - grantsService.fromAssetsToFloat(sa.total_expenses))
      .reduce((sum, amount) => sum + amount, 0);

    const universityOverheadAmount = awardee.isSubawardee ? 0 : grantsService.fromAssetsToFloat(award.university_fee);

    const totalAmount = awardee.isSubawarde
      ? piAmount + subawardeesAmount
      : piAmount + subawardeesAmount + universityOverheadAmount;

    const requestedAmount = requestedPiAmount + requestedSubawardeesAmount;
    const pendingAmount = pendingPiAmount + pendingSubawardeesAmount;
    const withdrawnAmount = withdrawnPiAmount + withdrawnSubawardeesAmount;
    const remainingAmount = totalAmount - withdrawnPiAmount - withdrawnSubawardeesAmount - universityOverheadAmount;

    const reciever = state.awardeeUsersList.find((user) => user.account.name == awardee.awardee);
    const pi = reciever; // PI is the user whose award we are browsing currently

    const project = state.awardeeProjectList.find((r) => r.id == awardee.projectId);
    const organization = state.awardeeTeamsList.find((rg) => rg.id == project.teamId);

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

      const subawardeeAmount = grantsService.fromAssetsToFloat(subawardee.total_amount);

      const requestedSubawardeeAmount = subawardeeWithdrawals
        .map((w) => grantsService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      const pendingSubawardeeAmount = subawardeeWithdrawals
        .filter((w) => w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING
          || w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED
          || w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED)
        .map((w) => grantsService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      const withdrawnSubawardeeAmount = subawardeeWithdrawals
        .filter((w) => w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PAID)
        .map((w) => grantsService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      const remainingSubawardeeAmount = grantsService.fromAssetsToFloat(subawardee.total_amount) - grantsService.fromAssetsToFloat(subawardee.total_expenses);

      const nextSubawardeesAmount = nextSubawardees
        .map((sa) => grantsService.fromAssetsToFloat(sa.total_amount))
        .reduce((sum, amount) => sum + amount, 0);

      const requestedNextSubawardeesAmount = nextSubawardeesWithdrawals
        .map((w) => grantsService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      const pendingNextSubawardeesAmount = nextSubawardeesWithdrawals
        .filter((w) => w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PENDING
          || w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.CERTIFIED
          || w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.APPROVED)
        .map((w) => grantsService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      const withdrawnNextSubawardeesAmount = nextSubawardeesWithdrawals
        .filter((w) => w.status == AWARD_WITHDRAWAL_REQUEST_STATUS.PAID)
        .map((w) => grantsService.fromAssetsToFloat(w.amount))
        .reduce((sum, amount) => sum + amount, 0);

      const remainingNextSubawardeesAmount = nextSubawardees
        .map((sa) => grantsService.fromAssetsToFloat(sa.total_amount) - grantsService.fromAssetsToFloat(sa.total_expenses))
        .reduce((sum, amount) => sum + amount, 0);

      const totalSubawardeeAmount = subawardeeAmount + nextSubawardeesAmount;
      const totalSubawardeeRequestedAmount = requestedSubawardeeAmount + requestedNextSubawardeesAmount;
      const totalSubawardeePendingAmount = pendingSubawardeeAmount + pendingNextSubawardeesAmount;
      const totalSubawardeeWithdrawnAmount = withdrawnSubawardeeAmount + withdrawnNextSubawardeesAmount;
      const totalSubawardeeRemainingAmount = remainingSubawardeeAmount + remainingNextSubawardeesAmount;

      const project = state.awardeeProjectList.find((r) => r.id == subawardee.projectId);
      const organization = state.awardeeTeamsList.find((rg) => rg.id == project.teamId);

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
        project,
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

        const project = state.awardeeProjectList.find((r) => r.id == withdrawalAwardee.projectId);
        const organization = state.awardeeTeamsList.find((rg) => rg.id == project.teamId);

        return {
          id: withdrawal.id,
          paymentNumber: withdrawal.payment_number,
          awardNumber: withdrawal.award_number,
          subawardNumber: withdrawalAwardee.isSubawardee ? withdrawal.subaward_number : undefined, // do not send subaward number for top award
          amount: grantsService.fromAssetsToFloat(withdrawal.amount),
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
    const foaSupplyAmount = grantsService.fromAssetsToFloat(state.foa.current_supply);
    const awardAmount = grantsService.fromAssetsToFloat(state.award.amount);
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
      .then(({ data: award }) => {
        commit('SET_AWARD', award);
        const awardee = award.awardees.find((a) => a.award_number == awardNumber && a.subaward_number == subawardNumber);
        commit('SET_AWARDEE', awardee);

        return grantsService.getFundingOpportunityAnnouncementByNumber(award.funding_opportunity_number);
      })
      .then(({ data: foa }) => {
        commit('SET_FUNDING_OPPORTUNITY', foa);

        return teamService.getTeam(foa.organizationId);
      })
      .then(({ data: foaOrganization }) => {
        commit('SET_FUNDING_OPPORTUNITY_ORGANIZATION', foaOrganization);

        return grantsService.getAwardWithdrawalRequestsByAward(awardNumber);
      })
      .then(({ data: { items: paymentRequests } }) => {
        commit('SET_AWARD_PAYMENT_REQUESTS_LIST', paymentRequests);

        return userService.getUsers(state.award.awardees
          .map((r) => r.awardee)
          .reduce((acc, awardee) => (acc.some((a) => a === awardee) ? acc : [awardee, ...acc]), []));
      })
      .then(({ data: { items: awardeeUsers } }) => {
        commit('SET_AWARDEE_USERS_LIST', awardeeUsers);
        return Promise.all(state.award.awardees.map((r) => r.projectId)
          .reduce((acc, projectId) => (acc.some((rId) => rId === projectId) ? acc : [projectId, ...acc]), [])
          .map((rId) => projectService.getProject(rId)));
      })
      .then((res) => {
        const projectList = res.map(({ data }) => data);
        commit('SET_AWARDEE_PROJECT_LIST', projectList);
        return Promise.all(projectList.map((r) => r.teamId)
          .reduce((acc, teamId) => (acc.some((rgId) => rgId === teamId) ? acc : [teamId, ...acc]), [])
          .map((rgId) => teamService.getTeam(rgId)));
      })
      .then((res) => {
        const teams = res.map(({ data }) => data)
        commit('SET_AWARDEE_TEAMS_LIST', teams);
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

  SET_AWARDEE_PROJECT_LIST(state, projects) {
    state.awardeeProjectList = projects;
  },

  SET_AWARDEE_TEAMS_LIST(state, teams) {
    state.awardeeTeamsList = teams;
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
