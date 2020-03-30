import _ from 'lodash';
import deipRpc from '@deip/rpc-client';
import Vue from 'vue';

import { ResearchGroupService } from '@deip/research-group-service';
import { UsersService } from '@deip/users-service';
import { ResearchService } from '@deip/research-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';

const researchGroupService = ResearchGroupService.getInstance();
const usersService = UsersService.getInstance();
const researchService = ResearchService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const state = {
  proposals: [],
  group: undefined,
  groupShares: [],
  researchList: [],
  members: [],
  joinRequests: [],
  invites: [],

  options: {
    isAddMemberDialogOpen: false,
    isHandleRequestDialogOpen: false,
    isTransferTokensDialogOpen: false
  },

  proposalListFilter: {
    areShownPastProposals: false,
    sortBy: 'creation_time',
    order: 'asc'
  },

  isLoadingResearchGroupDetails: undefined,
  isLoadingResearchGroupMembers: undefined,
  isLoadingResearchGroupResearchList: undefined,
  isLoadingResearchGroupProposals: undefined,
  isLoadingResearchGroupJoinRequests: undefined,
  isLoadingResearchesRefDetails: undefined
};

// getters
const getters = {
  proposals: state => state.proposals,
  group: state => state.group,
  groupShares: state => state.groupShares,
  members: state => state.members,
  invites: state => state.invites,
  proposalListFilter: state => state.proposalListFilter,
  researchList: (state, getters, rootState, rootGetters) => {
    const user = rootGetters['auth/user'];
    return state.researchList.filter(item => !item.is_private || state.groupShares.some(share => share.owner == user.username));
  },
  options: state => state.options,
  joinRequests: state => state.joinRequests,
  pendingJoinRequests: state => state.joinRequests.filter(r => r.status == 'pending'),

  isLoadingResearchGroupDetails: state => state.isLoadingResearchGroupDetails,
  isLoadingResearchGroupMembers: state => state.isLoadingResearchGroupMembers,
  isLoadingResearchGroupResearchList: state => state.isLoadingResearchGroupResearchList,
  isLoadingResearchGroupProposals: state => state.isLoadingResearchGroupProposals,
  isLoadingResearchGroupJoinRequests: state => state.isLoadingResearchGroupJoinRequests
};

// actions
const actions = {

  loadResearchGroup({ commit, dispatch, state }, { permlink }) {
    commit('SET_GROUP_DETAILS_LOADING_STATE', true);

    return deipRpc.api.getResearchGroupByPermlinkAsync(permlink)
      .then(data => {
        commit('SET_RESEARCH_GROUP', data);

        const proposalsLoad = new Promise((resolve, reject) => {
          dispatch('loadResearchGroupProposals', {
            groupId: state.group.id,
            notify: resolve
          });
        });

        const researchLoad = new Promise((resolve, reject) => {
          dispatch('loadResearchList', {
            groupId: state.group.id,
            notify: resolve
          });
        });

        const membersLoad = new Promise((resolve, reject) => {
          dispatch('loadResearchGroupMembers', {
            groupId: state.group.id,
            notify: resolve
          });
        });

        const joinRequestsLoad = new Promise((resolve, reject) => {
          dispatch('loadJoinRequests', {
            groupId: state.group.id,
            notify: resolve
          });
        });

        const groupInvitesPromise = dispatch('loadGroupInvites', { groupId: state.group.id });

        return Promise.all([
          proposalsLoad,
          researchLoad,
          membersLoad,
          joinRequestsLoad,
          groupInvitesPromise
        ])
      })
      .finally(() => {
        commit('SET_GROUP_DETAILS_LOADING_STATE', false);
      });
  },

  loadResearchGroupProposals({ commit }, { groupId, notify }) {
    commit('SET_GROUP_PROPOSALS_LOADING_STATE', true);

    // const getParsedProposal = proposal => {
    //   proposal.data = JSON.parse(proposal.data);
    //   return proposal;
    // };

    deipRpc.api.getProposalsByResearchGroupIdAsync(groupId)
      .then(data => {

        return Promise.all(
          data.map(
            (item) => researchGroupService.extendProposalByRelatedInfo({
              ...item,
              ...{ data: JSON.parse(item.data) }
            })
          )
        );
      })
      .then(data => {
        commit('SET_PROPOSALS', data);
      })
      .finally(() => {
        commit('SET_GROUP_PROPOSALS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadResearchList({ commit }, { groupId, notify }) {
    const researchResult = [];
    commit('SET_GROUP_RESEARCH_LIST_LOADING_STATE', true);

    deipRpc.api.getResearchesByResearchGroupIdAsync(groupId)
      .then(list => {
        researchResult.push(...list);
        return Promise.all(
          list.map(item => expertiseContributionsService.getExpertiseContributionsByResearch(item.id))
        );
      })
      .then(list => {
        const tvoMap = _.chain(list)
          .flatten()
          .groupBy('research_id')
          .value();

        researchResult.forEach(research => {
          research.totalVotes = tvoMap[research.id] ? tvoMap[research.id] : [];
        });

        return researchResult;
      })
      .then(data => {
        commit('SET_RESEARCHES_REFS_DETAILS_LOADING_STATE', true);
        Promise.all(data.map(({id}) => researchService.getResearch(id)))
          .then(refs => {
            const researchList = refs.map((researchRef, i) => {
              return {
                ...data[i],
                researchRef
              };
            });
            commit('SET_GROUP_RESEARCH_LIST', researchList);
          }, (err) => {console.log(err);})
          .finally(() => {
            commit('SET_RESEARCHES_REFS_DETAILS_LOADING_STATE', false);
          });
      })
      .finally(() => {
        commit('SET_GROUP_RESEARCH_LIST_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadResearchGroupMembers({ commit, state }, { groupId, notify }) {
    const members = [];
    commit('SET_GROUP_MEMBERS_LOADING_STATE', true);

    deipRpc.api.getResearchGroupTokensByResearchGroupAsync(groupId)
      .then(rgtList => {
        commit('SET_GROUP_SHARES', rgtList);
        rgtList.forEach(rgt => {
          members.push({ rgt: rgt });
        });
        return usersService.getEnrichedProfiles(members.map(member => member.rgt.owner));
      })
      .then((users) => {
        const promises = [];
        members.forEach(member => {
          const user = users.find(user => user.account.name == member.rgt.owner);
          member.account = user.account;
          member.profile = user.profile;
          promises.push(deipRpc.api.getExpertTokensByAccountNameAsync(member.account.name));
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

  loadGroupInvites({ commit, state }, { groupId }) {
    let invites = [];

    return deipRpc.api.getResearchGroupInvitesByResearchGroupIdAsync(groupId)
      .then(invitesList => {
        invites = invitesList;
        return usersService.getEnrichedProfiles(invites.map(invite => invite.account_name));
      })
      .then(users => {
        invites.forEach((invite, index) => {
          invite.user = users[index];
        });

        commit('SET_GROUP_INVITES', invites);
      })
      .catch(e => {
        console.log(e);
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
        return usersService.getEnrichedProfiles(joinRequests.map(request => request.username));
      }, (err) => {
        console.log(err);
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
  ['SET_PROPOSALS'](state, proposals) {
    Vue.set(state, 'proposals', proposals);
  },

  ['SET_RESEARCH_GROUP'](state, group) {
    Vue.set(state, 'group', group);
  },

  ['SET_GROUP_SHARES'](state, shares) {
    Vue.set(state, 'groupShares', shares);
  },

  ['SET_GROUP_MEMBERS'](state, members) {
    Vue.set(state, 'members', members);
  },

  ['SET_GROUP_RESEARCH_LIST'](state, researchList) {
    Vue.set(state, 'researchList', researchList);
  },

  ['CHANGE_PROPOSAL'](state, payload) {
    let index = state.proposals.indexOf(payload.old);

    if (index !== -1) {
      state.proposals.splice(index, 1, payload.new);
    }
  },

  ['SET_GROUP_INVITES'](state, invites) {
    Vue.set(state, 'invites', invites);
  },

  ['UPDATE_PROPOSAL_FILTER'](state, { key, value }) {
    Vue.set(state.proposalListFilter, key, value);
  },

  ['UPDATE_OPTIONS'](state, { key, value }) {
    Vue.set(state.options, key, value);
  },

  ['SET_JOIN_REQUESTS'](state, joinRequests) {
    Vue.set(state, 'joinRequests', joinRequests);
  },

  ['SET_GROUP_DETAILS_LOADING_STATE'](state, value) {
    state.isLoadingResearchGroupDetails = value;
  },

  ['SET_GROUP_MEMBERS_LOADING_STATE'](state, value) {
    state.isLoadingResearchGroupMembers = value;
  },

  ['SET_GROUP_RESEARCH_LIST_LOADING_STATE'](state, value) {
    state.isLoadingResearchGroupResearchList = value;
  },

  ['SET_GROUP_PROPOSALS_LOADING_STATE'](state, value) {
    state.isLoadingResearchGroupProposals = value;
  },

  ['SET_GROUP_JOIN_REQUESTS_LOADING_STATE'](state, value) {
    state.isLoadingResearchGroupJoinRequests = value;
  },

  ['SET_RESEARCHES_REFS_DETAILS_LOADING_STATE'](state, value) {
    state.isLoadingResearchesRefDetails = value;
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
