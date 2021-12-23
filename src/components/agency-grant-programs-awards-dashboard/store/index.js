import Vue from 'vue';
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
  currentOrganization: null,
  tokenInfo: null,
  isLoadingOrganizationDashboardPage: undefined,

  awardsFoaList: [],
  awardsList: [],
  awardeesList: [],
  awardeeUsersList: [],
  awardsPaymentRequestsList: [],
  awardeeProjectList: [],
  awardeeTeamsList: []
};

// getters
const getters = {
  isLoadingOrganizationDashboardPage: (state) => state.isLoadingOrganizationDashboardPage,
  currentOrganization: (state) => state.currentOrganization,
  tokenInfo: (state) => state.tokenInfo,
  awards: (state) => state.awardeesList.map((a, idx) => {
    const award = state.awardsList.find((award) => award.award_number == a.award_number);
    const awardee = { ...a, isSubawardee: a.source != '' };
    const subawardees = grantsService.findAwardSubawardees(awardee, state.awardeesList);
    const withdrawals = state.awardsPaymentRequestsList.filter((w) => w.award_number == awardee.award_number && w.subaward_number == awardee.subaward_number);
    const subWithdrawals = subawardees.reduce((acc, sa) => {
      const withdrawals = state.awardsPaymentRequestsList.filter((w) => w.award_number == sa.award_number && w.subaward_number == sa.subaward_number);
      return [...acc, ...withdrawals];
    }, []);

    const totalAmount = awardee.isSubawardee
      ? grantsService.fromAssetsToFloat(awardee.total_amount) + subawardees.reduce((acc, a) => acc + grantsService.fromAssetsToFloat(a.total_amount), 0)
      : grantsService.fromAssetsToFloat(award.amount);

    const universityOverheadAmount = awardee.isSubawardee ? 0 : grantsService.fromAssetsToFloat(award.university_fee);

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

    const requestedAmount = requestedPiAmount + requestedSubawardeesAmount;
    const pendingAmount = pendingPiAmount + pendingSubawardeesAmount;
    const withdrawnAmount = withdrawnPiAmount + withdrawnSubawardeesAmount;

    const remainingAmount = totalAmount - withdrawnPiAmount - withdrawnSubawardeesAmount - universityOverheadAmount;

    const reciever = state.awardeeUsersList.find((user) => user.account.name == awardee.awardee);
    const topPi = state.awardeeUsersList.find((user) => user.account.name == award.awardee); // top PI is the top level award receiver

    const project = state.awardeeProjectList.find((r) => r.id == awardee.projectId);
    const organization = state.awardeeTeamsList.find((rg) => rg.id == project.teamId);
    const foa = state.awardsFoaList.find((foa) => foa.funding_opportunity_number == award.funding_opportunity_number);

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
      project,
      topPi,
      reciever
    };
  }),

  payments: (state) => state.awardsPaymentRequestsList.map((withdrawal, idx) => {
    const award = state.awardsList.find((a) => a.award_number == withdrawal.award_number);
    const a = state.awardeesList.find((a) => a.award_number == withdrawal.award_number && a.subaward_number == withdrawal.subaward_number);
    const awardee = { ...a, isSubawardee: a.source != '' };
    // let parentAwardee = awardee.isSubawardee ? award.awardees.find(a => a.awardee == awardee.source) : null;
    const parentAwardees = grantsService.findParentAwardees(awardee, state.awardeesList);
    const project = state.awardeeProjectList.find((r) => r.id == awardee.projectId);
    const parentProjects = parentAwardees
      .reduce((acc, a) => [...acc, state.awardeeProjectList.find((r) => r.id == a.projectId)], []);

    const organization = state.awardeeTeamsList.find((rg) => rg.id == project.teamId);
    const parentOrganizations = state.awardeeTeamsList.filter((rg) => parentProjects.some((r) => r.teamId == rg.id));
    const requester = state.awardeeUsersList.find((user) => user.account.name == withdrawal.requester);

    const topPi = state.awardeeUsersList.find((user) => user.account.name == award.awardee); // top PI is the top level award receiver
    const foa = state.awardsFoaList.find((foa) => foa.funding_opportunity_number == award.funding_opportunity_number);

    return {
      id: withdrawal.id,
      paymentNumber: withdrawal.payment_number,
      awardNumber: withdrawal.award_number,
      subawardNumber: awardee.isSubawardee ? withdrawal.subaward_number : undefined, // do not send subaward number for top award
      amount: grantsService.fromAssetsToFloat(withdrawal.amount),
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
    };
  })
};

// actions
const actions = {

  loadAgencyAwardsDashboardPage({ commit, dispatch, state }) {
    commit('SET_ORGANIZATION_DASHBOARD_LOADING_STATE', true);
    return teamService.getTeam(Vue.$env.TENANT)
      .then((organization) => {
        commit('SET_CURRENT_ORGANIZATION', organization);
        return Promise.all([
          dispatch('loadAwards', {})
        ]);
      })
      .then(() => {
        return Promise.all([
          dispatch('loadTokenStats', {})
        ]);
      })
      .finally(() => {
        commit('SET_ORGANIZATION_DASHBOARD_LOADING_STATE', false);
      });
  },

  loadAwards({ commit, dispatch, state }, { notify }) {
    // TODO: load awards for the current organization only
    return grantsService.getFundingOpportunityAnnouncementsListing(1, 10000)
      .then((awardsFoaList) => {
        commit('SET_AWARDS_FUNDING_OPPORTUNITIES_LIST', awardsFoaList);

        return Promise.all(awardsFoaList.map((foa) => grantsService.getAwardsByFundingOpportunity(foa.funding_opportunity_number)));
      })
      .then((awards) => {
        const flatten = [].concat.apply([], awards);
        commit('SET_AWARDS_LIST', flatten);

        return Promise.all(flatten.map((award) => grantsService.getAwardWithdrawalRequestsByAward(award.award_number)));
      })
      .then((paymentRequests) => {
        const flatten = [].concat.apply([], paymentRequests);
        commit('SET_PAYMENT_REQUESTS_LIST', flatten);

        return userService.getUsers(state.awardeesList
          .map((r) => r.awardee)
          .reduce((acc, awardee) => (acc.some((a) => a === awardee) ? acc : [awardee, ...acc]), []));
      })
      .then((awardeeUsers) => {
        commit('SET_AWARDEE_USERS_LIST', awardeeUsers);

        return Promise.all(state.awardeesList.map((r) => r.projectId)
          .reduce((acc, projectId) => (acc.some((rId) => rId === projectId) ? acc : [projectId, ...acc]), [])
          .map((rId) => projectService.getProject(rId)));
      })
      .then((projectList) => {
        commit('SET_AWARDEE_PROJECT_LIST', projectList);

        return Promise.all(projectList.map((r) => r.teamId)
          .reduce((acc, teamId) => (acc.some((rgId) => rgId === teamId) ? acc : [teamId, ...acc]), [])
          .map((rgId) => teamService.getTeam(rgId)));
      })
      .then((teams) => {
        commit('SET_AWARDEE_TEAMS_LIST', teams);
      })
      .catch((err) => { console.error(err); })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadTokenStats({ commit, dispatch, state }, { notify }) {

    const allOrganizationFundingOpportunities = [...state.awardsFoaList];
    const allOrganizationFundingOpportunitiesAwards = [];

    return Promise.all(allOrganizationFundingOpportunities.map((foa) => grantsService.getAwardsByFundingOpportunity(foa.funding_opportunity_number)))
      .then((list) => {
        allOrganizationFundingOpportunitiesAwards.push(...[].concat.apply([], list));

        const totalIssuedTokensAmount = allOrganizationFundingOpportunities.reduce((acc, foa) => acc + grantsService.fromAssetsToFloat(foa.amount), 0);

        const totalAwardedTokensAmount = allOrganizationFundingOpportunitiesAwards.reduce((acc, award) => (award.status == AWARD_STATUS.APPROVED ? acc + grantsService.fromAssetsToFloat(award.amount) : acc), 0);

        const totalAvailableTokensAmount = totalIssuedTokensAmount - totalAwardedTokensAmount;

        const totalWithdrawnTokensAmount = allOrganizationFundingOpportunitiesAwards.reduce((acc, award) => (award.status == AWARD_STATUS.APPROVED ? acc + award.awardees.reduce((acc, awardee) => acc + grantsService.fromAssetsToFloat(awardee.total_expenses), 0) : acc), 0);

        const totalCirculatingTokensAmount = totalIssuedTokensAmount - totalWithdrawnTokensAmount;

        commit('SET_AWARDS_TOKEN_STATISTIC', {
          totalIssuedTokensAmount,
          totalCirculatingTokensAmount,
          totalAvailableTokensAmount,
          totalAwardedTokensAmount,
          totalWithdrawnTokensAmount
        });
      })
      .catch((err) => { console.error(err); })
      .finally(() => {
        if (notify) notify();
      });
  }
};

// mutations
const mutations = {

  SET_ORGANIZATION_DASHBOARD_LOADING_STATE(state, isLoading) {
    state.isLoadingOrganizationDashboardPage = isLoading;
  },

  SET_CURRENT_ORGANIZATION(state, currentOrganization) {
    state.currentOrganization = currentOrganization;
  },

  SET_AWARDS_FUNDING_OPPORTUNITIES_LIST(state, awardsFoaList) {
    state.awardsFoaList = awardsFoaList;
  },

  SET_AWARDS_LIST(state, awardsList) {
    state.awardsList = awardsList;
    state.awardeesList = [].concat.apply([], awardsList.map((a) => a.awardees));
  },

  SET_PAYMENT_REQUESTS_LIST(state, paymentRequestsList) {
    state.awardsPaymentRequestsList = paymentRequestsList;
  },

  SET_AWARDEE_USERS_LIST(state, awardeeUsers) {
    state.awardeeUsersList = awardeeUsers;
  },

  SET_AWARDEE_PROJECT_LIST(state, projects) {
    state.awardeeProjectList = projects;
  },

  SET_AWARDEE_TEAMS_LIST(state, teams) {
    state.awardeeTeamsList = teams;
  },

  SET_AWARDS_TOKEN_STATISTIC(state, stats) {
    state.tokenInfo = stats;
  }

};

const namespaced = true;

export const agencyGrantProgramAwardsDashboardStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
