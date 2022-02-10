import _ from 'lodash';

import { UserService } from '@deip/user-service';
import { ProjectService } from '@deip/project-service';
import { InvestmentOpportunityService } from '@deip/investment-opportunity-service';
import { AssetsService } from '@deip/assets-service';
import { TeamService } from '@deip/team-service';
import { GrantsService } from '@deip/grants-service';
import { camelizeObjectKeys } from '@/utils/helpers';

const teamService = TeamService.getInstance();
const assetsService = AssetsService.getInstance();
const investmentOpportunityService = InvestmentOpportunityService.getInstance();
const userService = UserService.getInstance();
const projectService = ProjectService.getInstance();
const grantsService = GrantsService.getInstance();


const STATE = {
  teamDetails: undefined,
  revenueHistory: [],
  projectList: [],
  joinRequests: [],
  invites: []
};

// getters
const GETTERS = {
  teamDetails: (state) => {
    const team = state.teamDetails;
    const balances = team.balances.reduce((acc, b) => {
      acc[b.symbol] = b.amount;
      return acc;
    }, {});

    return {
      ...team,
      balances,
      projectList: state.projectList,
      revenueHistory: state.revenueHistory,
      pendingJoinRequests: state.joinRequests.filter((r) => r.status == 'pending'),
      invites: state.invites,
      accountSecurityTokenBalance: state.accountSecurityTokenBalance
    };
  }
};

// actions
const ACTIONS = {
  getTeamDetails({ commit, dispatch, state }, teamId) {
    return teamService.getTeam(teamId)
      .then(({ data }) => {
        commit('setTeam', data);

        const teamProjectList = dispatch('loadTeamProjectList', state.teamDetails._id);
        const teamRevenueHistory = dispatch('loadTeamRevenueHistory', state.teamDetails._id);

        return Promise.all([
          teamProjectList,
          teamRevenueHistory
        ]);
      });
  },

  loadTeamProjectList({ commit }, id) {
    return projectService.getTeamProjectListing(id)
      .then(({ data: { items: projectList } }) => {
        commit('setProjectList', projectList);
        return Promise.all(projectList.reduce((arr, r) => {
          r.securityTokens.forEach((rst) => arr.push(
            assetsService.getAccountAssetBalance(id, rst.symbol)
          ));
          return arr;
        }, []));
      })
      .then((res) => {
        const accountSecurityTokenBalance = res.map(({ data }) => data)
        commit('setAccountSecurityTokenBalance', accountSecurityTokenBalance);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  loadTeamRevenueHistory({ commit }, id) {
    return investmentOpportunityService.getAccountRevenueHistory(id)
      .then(({ data: { items: revenueHistory } }) => {
        commit('setRevenueHistory', revenueHistory);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  // [OBSOLETE]
  loadGroupInvites({ commit, state }, teamId) {
    // const pendingInvites = [];

    // return teamService.getTeamPendingInvites(teamId)
    //   .then(({ data: { items: invites } }) => {
    //     pendingInvites.push(...invites);
    //     return userService.getUsers(pendingInvites.map((invite) => invite.invitee));
    //   })
    //   .then(({ data: { items: users } }) => {
    //     for (let i = 0; i < pendingInvites.length; i++) {
    //       pendingInvites[i].user = users[i];
    //     }
    //     commit('setInvites', pendingInvites);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  },

  // [OBSOLETE]
  loadJoinRequests({ commit, state }, teamId) {
    // const joinRequests = [];
    // teamService.getJoinRequestsByGroup(teamId)
    //   .then(({ data: { items: requests } }) => {
    //     joinRequests.push(...requests);
    //     return userService.getUsers(joinRequests.map((request) => request.username));
    //   }, (err) => {
    //     console.error(err);
    //   })
    //   .then(({ data: { item: users } }) => {
    //     joinRequests.forEach((request, idx) => {
    //       const user = users[idx];
    //       request.user = user;
    //     });
    //     commit('setRequests', joinRequests);
    //   });
  }
};

// mutations
const MUTATIONS = {
  setTeam(state, team) {
    // state.teamDetails = camelizeObjectKeys(team);
    state.teamDetails = team;
  },

  setInvites(state, invites) {
    state.invites = invites;
  },

  setRequests(state, joinRequests) {
    state.joinRequests = joinRequests;
  },

  setProjectList(state, projectList) {
    state.projectList = projectList;
  },

  setRevenueHistory(state, revenueHistory) {
    state.revenueHistory = revenueHistory;
  },

  setAccountSecurityTokenBalance(state, accountSecurityTokenBalance) {
    state.accountSecurityTokenBalance = accountSecurityTokenBalance;
  }
};

const namespaced = true;

export const teamDetailsStore = {
  namespaced,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
