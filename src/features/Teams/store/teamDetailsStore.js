import _ from 'lodash';

import { ResearchGroupService } from '@deip/research-group-service';
import { UsersService } from '@deip/users-service';
import { ResearchService } from '@deip/research-service';
import { BlockchainService } from '@deip/blockchain-service';
import { InvestmentsService } from '@deip/investments-service';
import { AssetsService } from '@deip/assets-service';

const assetsService = AssetsService.getInstance();
const investmentsService = InvestmentsService.getInstance();
const researchGroupService = ResearchGroupService.getInstance();
const usersService = UsersService.getInstance();
const researchService = ResearchService.getInstance();
const blockchainService = BlockchainService.getInstance();

import { camelizeObjectKeys } from '@/utils/helpers';

const STATE = {
  teamDetails: undefined,
  revenueHistory: [],
  researchList: [],
  joinRequests: [],
  invites: []
};

// getters
const GETTERS = {
  teamDetails: (state) => {
    const researchGroup = state.teamDetails;
    const balances = researchGroup.account.balances.reduce((acc, b) => {
      acc[b.split(' ')[1]] = blockchainService.fromAssetsToFloat(b);
      return acc;
    }, {});

    return {
      ...researchGroup,
      balances,
      researchList: state.researchList,
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
    return researchGroupService.getResearchGroup(teamId)
      .then((data) => {
        commit('setTeam', data);

        const researchGroupResearchList = dispatch('loadResearchGroupResearchList', state.teamDetails.externalId);
        const researchGroupRevenueHistory = dispatch('loadResearchGroupRevenueHistory', state.teamDetails.externalId);

        return Promise.all([
          researchGroupResearchList,
          researchGroupRevenueHistory
        ]);
      });
  },

  loadResearchGroupResearchList({ commit }, externalId) {
    return researchService.getResearchGroupResearchListing(externalId)
      .then((researchList) => {
        commit('setResearchList', researchList);
        return Promise.all(researchList.reduce((arr, r) => {
          r.security_tokens.forEach((rst) => arr.push(
            assetsService.getAccountAssetBalance(externalId, rst.split(' ')[1])
          ));
          return arr;
        }, []));
      })
      .then((accountSecurityTokenBalance) => {
        commit('setAccountSecurityTokenBalance', accountSecurityTokenBalance);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  loadResearchGroupRevenueHistory({ commit }, externalId) {
    return investmentsService.getAccountRevenueHistory(externalId)
      .then((revenueHistory) => {
        commit('setRevenueHistory', revenueHistory);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  loadGroupInvites({ commit, state }, teamId) {
    const pendingInvites = [];

    return researchGroupService.getResearchGroupPendingInvites(teamId)
      .then((invites) => {
        pendingInvites.push(...invites);
        return usersService.getUsers(pendingInvites.map((invite) => invite.invitee));
      })
      .then((users) => {
        for (let i = 0; i < pendingInvites.length; i++) {
          pendingInvites[i].user = users[i];
        }
        commit('setInvites', pendingInvites);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  loadJoinRequests({ commit, state }, teamId) {
    const joinRequests = [];
    researchGroupService.getJoinRequestsByGroup(teamId)
      .then((requests) => {
        joinRequests.push(...requests);
        return usersService.getUsers(joinRequests.map((request) => request.username));
      }, (err) => {
        console.error(err);
      })
      .then((users) => {
        joinRequests.forEach((request, idx) => {
          const user = users[idx];
          request.user = user;
        });
        commit('setRequests', joinRequests);
      });
  }
};

// mutations
const MUTATIONS = {
  setTeam(state, team) {
    state.teamDetails = camelizeObjectKeys(team);
  },

  setInvites(state, invites) {
    state.invites = invites;
  },

  setRequests(state, joinRequests) {
    state.joinRequests = joinRequests;
  },

  setResearchList(state, researchList) {
    state.researchList = researchList;
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
