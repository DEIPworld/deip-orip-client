import _ from 'lodash';

import { ResearchGroupService } from '@deip/research-group-service';
import { ProposalsService } from '@deip/proposals-service';
import { UsersService } from '@deip/users-service';
import { ResearchService } from '@deip/research-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { BlockchainService } from '@deip/blockchain-service';
import { InvestmentsService } from '@deip/investments-service';
import { AssetsService } from '@deip/assets-service';

const assetsService = AssetsService.getInstance();
const investmentsService = InvestmentsService.getInstance();
const researchGroupService = ResearchGroupService.getInstance();
const usersService = UsersService.getInstance();
const researchService = ResearchService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();
const blockchainService = BlockchainService.getInstance();
const proposalsService = ProposalsService.getInstance();

const state = {
  // proposals: [],
  group: undefined,
  members: [],
  revenueHistory: [],
  researchList: [],
  joinRequests: [],
  invites: [],

  options: {
    isAddMemberDialogOpen: false,
    isHandleRequestDialogOpen: false,
    isTransferTokensDialogOpen: false
  },

  // proposalListFilter: {
  //   areShownPastProposals: false,
  //   sortBy: 'creation_time',
  //   order: 'asc'
  // },

  isLoadingResearchGroupDetails: undefined,
  isLoadingResearchGroupMembers: undefined,
  isLoadingResearchGroupProposals: undefined,
  isLoadingResearchGroupJoinRequests: undefined
};

// getters
const getters = {

  // proposals: (state) => state.proposals,
  group: (state) => {
    const researchGroup = state.group;
    const balances = researchGroup.account.balances.reduce((acc, b) => {
      acc[b.split(' ')[1]] = blockchainService.fromAssetsToFloat(b);
      return acc;
    }, {});

    return {
      ...researchGroup,
      balances,
      researchList: state.researchList,
      revenueHistory: state.revenueHistory,
      accountSecurityTokenBalance: state.accountSecurityTokenBalance
    };
  },
  members: (state) => state.members,
  invites: (state) => state.invites,
  // proposalListFilter: (state) => state.proposalListFilter,
  options: (state) => state.options,
  joinRequests: (state) => state.joinRequests,
  pendingJoinRequests: (state) => state.joinRequests.filter((r) => r.status == 'pending'),

  isLoadingResearchGroupDetails: (state) => state.isLoadingResearchGroupDetails,
  isLoadingResearchGroupMembers: (state) => state.isLoadingResearchGroupMembers,
  isLoadingResearchGroupProposals: (state) => state.isLoadingResearchGroupProposals,
  isLoadingResearchGroupJoinRequests: (state) => state.isLoadingResearchGroupJoinRequests
};

// actions
const actions = {

  loadResearchGroup({ commit, dispatch, state }, { teamId }) {
    commit('SET_GROUP_DETAILS_LOADING_STATE', true);

    return researchGroupService.getResearchGroup(teamId)
      .then((data) => {
        commit('SET_RESEARCH_GROUP', data);

        const membersLoad = new Promise((resolve, reject) => {
          dispatch('loadResearchGroupMembers', {
            researchGroupExternalId: state.group.external_id,
            notify: resolve
          });
        });

        const joinRequestsLoad = new Promise((resolve, reject) => {
          dispatch('loadJoinRequests', {
            groupId: state.group.id,
            notify: resolve
          });
        });

        const groupInvitesPromise = dispatch('loadGroupInvites', { researchGroupExternalId: state.group.external_id });
        const researchGroupResearchList = dispatch('loadResearchGroupResearchList', state.group.external_id);
        const researchGroupRevenueHistory = dispatch('loadResearchGroupRevenueHistory', state.group.external_id);

        return Promise.all([
          // proposalsLoad,
          membersLoad,
          joinRequestsLoad,
          groupInvitesPromise,
          researchGroupResearchList,
          researchGroupRevenueHistory
        ]);
      })
      .finally(() => {
        commit('SET_GROUP_DETAILS_LOADING_STATE', false);
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

  loadResearchGroupMembers({ commit, state }, { researchGroupExternalId, notify }) {
    const members = [];
    commit('SET_GROUP_MEMBERS_LOADING_STATE', true);
    usersService.getUsersByResearchGroup(researchGroupExternalId)
      .then((users) => {
        const promises = [];
        users.forEach((user) => {
          const member = {
            account: user.account,
            profile: user.profile
          };
          members.push(member);
          promises.push(expertiseContributionsService.getAccountExpertiseTokens(member.account.name));
        });
        return Promise.all(promises);
      })
      .then((expList) => {
        members.forEach((member, idx) => {
          const exp = expList[idx];
          member.expertise = exp;
        });
        commit('SET_GROUP_MEMBERS', members);
      })
      .finally(() => {
        commit('SET_GROUP_MEMBERS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadGroupInvites({ commit, state }, { researchGroupExternalId }) {
    const pendingInvites = [];

    return researchGroupService.getResearchGroupPendingInvites(researchGroupExternalId)
      .then((invites) => {
        pendingInvites.push(...invites);
        return usersService.getEnrichedProfiles(pendingInvites.map((invite) => invite.invitee));
      })
      .then((users) => {
        for (let i = 0; i < pendingInvites.length; i++) {
          pendingInvites[i].user = users[i];
        }
        commit('SET_GROUP_INVITES', pendingInvites);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  changeProposal({ commit }, payload) {
    commit('CHANGE_PROPOSAL', payload);
  },
  updateProposalFilter({ commit }, payload) {
    commit('UPDATE_PROPOSAL_FILTER', payload);
  },
  changeOptions({ commit }, payload) {
    commit('UPDATE_OPTIONS', payload);
  },

  loadJoinRequests({ commit, state }, { groupId, notify }) {
    const joinRequests = [];
    commit('SET_GROUP_JOIN_REQUESTS_LOADING_STATE', true);
    researchGroupService.getJoinRequestsByGroup(groupId)
      .then((requests) => {
        joinRequests.push(...requests);
        return usersService.getEnrichedProfiles(joinRequests.map((request) => request.username));
      }, (err) => {
        console.error(err);
      })
      .then((users) => {
        joinRequests.forEach((request, idx) => {
          const user = users[idx];
          request.user = user;
        });
        commit('SET_JOIN_REQUESTS', joinRequests);
      })
      .finally(() => {
        commit('SET_GROUP_JOIN_REQUESTS_LOADING_STATE', false);
        if (notify) notify();
      });
  }
};

// mutations
const mutations = {
  // SET_PROPOSALS(state, proposals) {
  //   state.proposals = proposals;
  // },

  SET_RESEARCH_GROUP(state, group) {
    state.group = group;
  },

  SET_GROUP_MEMBERS(state, members) {
    state.members = members;
  },

  // CHANGE_PROPOSAL(state, payload) {
  //   const index = state.proposals.indexOf(payload.old);

  //   if (index !== -1) {
  //     state.proposals.splice(index, 1, payload.new);
  //   }
  // },

  SET_GROUP_INVITES(state, invites) {
    state.invites = invites;
  },

  // UPDATE_PROPOSAL_FILTER(state, { key, value }) {
  //   state.proposalListFilter[key] = value;
  // },

  UPDATE_OPTIONS(state, { key, value }) {
    state.options[key] = value;
  },

  SET_JOIN_REQUESTS(state, joinRequests) {
    state.joinRequests = joinRequests;
  },

  SET_GROUP_DETAILS_LOADING_STATE(state, value) {
    state.isLoadingResearchGroupDetails = value;
  },

  SET_GROUP_MEMBERS_LOADING_STATE(state, value) {
    state.isLoadingResearchGroupMembers = value;
  },

  SET_GROUP_PROPOSALS_LOADING_STATE(state, value) {
    state.isLoadingResearchGroupProposals = value;
  },

  SET_GROUP_JOIN_REQUESTS_LOADING_STATE(state, value) {
    state.isLoadingResearchGroupJoinRequests = value;
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

export const researchGroupStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
