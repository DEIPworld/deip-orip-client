import _ from 'lodash';
import deipRpc from '@deip/rpc-client';
import Vue from 'vue';
import moment from 'moment';

import { UsersService } from '@deip/users-service';
import { UserService } from '@deip/user-service';
import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';
import { ResearchContentService } from '@deip/research-content-service';
import { ResearchGroupService } from '@deip/research-group-service';
import { ResearchService } from '@deip/research-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';

const userService = UserService.getInstance();
const usersService = UsersService.getInstance();
const researchGroupService = ResearchGroupService.getInstance();
const researchContentReviewsService = ResearchContentReviewsService.getInstance();
const researchService = ResearchService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();
const researchContentService = ResearchContentService.getInstance();

const state = {
  account: undefined,
  profile: undefined,
  groups: [],
  expertise: [],
  invites: [],
  reviewRequests: [],
  researchesRef: [],
  eciStatsByDiscipline: undefined,

  filter: {
    criteria: null,
    contributionType: null,
    fromDate: null,
    toDate: null
  },

  isLoadingUserGroups: false,
  isLoadingUserExpertise: false,
  isLoadingUserInvites: false,
  isLoadingResearchesRefDetails: false
};

// getters
const getters = {
  userInfo: (state, getters) => ({ account: state.account, profile: state.profile }),

  groups: (state) => state.groups,
  expertise: (state) => state.expertise,
  invites: (state) => state.invites,
  reviewRequests: (state) => state.reviewRequests,

  filter: (state) => state.filter,
  eciStatsByDiscipline: (state, getters) => state.eciStatsByDiscipline,

  isLoadingUserGroups: (state) => state.isLoadingUserGroups,
  isLoadingUserExpertise: (state) => state.isLoadingUserExpertise,
  isLoadingUserInvites: (state) => state.isLoadingUserInvites
};

// actions
const actions = {

  loadUserDetailsPage({
    state, dispatch, commit, rootGetters
  }, { username }) {
    commit('RESET_STATE');
    const currentUser = rootGetters['auth/user'];
    const isMyPage = currentUser.username == username;

    const accountLoad = new Promise((resolve, reject) => {
      dispatch('loadUserAccount', { username, notify: resolve });
    });
    const profileLoad = new Promise((resolve, reject) => {
      dispatch('loadUserProfile', { username, notify: resolve });
    });
    const expertiseLoad = new Promise((resolve, reject) => {
      dispatch('loadExpertise', { username, notify: resolve });
    });
    const invitesLoad = isMyPage ? new Promise((resolve, reject) => {
      dispatch('loadUserInvites', { username, notify: resolve });
    }) : Promise.resolve();

    const reviewRequestsLoad = isMyPage ? new Promise((resolve, reject) => {
      dispatch('loadUserReviewRequests', { username, notify: resolve });
    }) : Promise.resolve();

    const groupsLoad = new Promise((resolve, reject) => {
      dispatch('loadGroups', { username, notify: resolve });
    });

    return Promise.all([
      accountLoad,
      profileLoad,
      expertiseLoad,
      invitesLoad,
      reviewRequestsLoad,
      groupsLoad
    ]);
  },

  loadAccountExpertiseDetailsPage({
    state, dispatch, commit, rootGetters
  }, { username }) {
    const accountLoad = new Promise((resolve, reject) => {
      dispatch('loadUserAccount', { username, notify: resolve });
    });
    const profileLoad = new Promise((resolve, reject) => {
      dispatch('loadUserProfile', { username, notify: resolve });
    });
    const expertiseLoad = new Promise((resolve, reject) => {
      dispatch('loadExpertise', { username, notify: resolve });
    });

    return Promise.all([accountLoad, profileLoad, expertiseLoad]);
  },

  loadUserAccount({ commit }, { username, notify } = {}) {
    return deipRpc.api.getAccountsAsync([username])
      .then(([account]) => {
        commit('SET_USER_ACCOUNT', account);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadGroups({ commit }, { username, notify } = {}) {
    return deipRpc.api.getResearchGroupTokensByAccountAsync(username)
      .then((data) => {
        const groupsInfo = Promise.all(
          data.map((groupToken) => researchGroupService.getResearchGroup(groupToken.research_group.external_id))
        );

        const groupsShares = Promise.all(
          data.map((groupToken) => deipRpc.api.getResearchGroupTokensByResearchGroupAsync(groupToken.research_group_id))
        );

        return Promise.all([groupsInfo, groupsShares]);
      })
      .then(([groupsInfo, groupsShares]) => _.each(groupsInfo, (item, i) => {
        item.shares = groupsShares[i];
      }))
      .then((groups) => {
        commit('SET_RESEARCH_GROUPS', groups);
      })
      .finally(() => {
        commit('SET_USER_GROUPS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadExpertise({ commit }, { username, notify } = {}) {
    commit('SET_USER_EXPERTISE_LOADING_STATE', true);
    const disciplinesName = [];
    return deipRpc.api.getExpertTokensByAccountNameAsync(username)
      .then((data) => {
        disciplinesName.push(...data.map(({ discipline_name }) => discipline_name));
        return Promise.all(
          data.map((item) => expertiseContributionsService.getAccountExpertiseStats(
            username,
            { discipline: item.discipline_external_id }
          ))
        );
        // commit('SET_EXPERTISE', data);
      })
      .then((data) => {
        const fullData = data.map((item, i) => ({
          ...item,
          discipline_name: disciplinesName[i]
        }));
        commit('SET_EXPERTISE', fullData);
      })
      .finally(() => {
        commit('SET_USER_EXPERTISE_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadUserProfile({ commit }, { username, notify } = {}) {
    return usersService.getUserProfile(username)
      .then((profile) => {
        commit('SET_USER_PROFILE', profile || null);
      }, (err) => {
        console.error(err);
      }).finally(() => {
        if (notify) notify();
      });
  },

  loadUserInvites({ commit }, { username, notify } = {}) {
    commit('SET_USER_INVITES_LOADING_STATE', true);
    const invites = [];
    return userService.getUserInvites(username)
      .then((list) => {
        const promises = [];
        for (let i = 0; i < list.length; i++) {
          const invite = list[i];
          invites.push(invite);
          promises.push(researchGroupService.getResearchGroup(invite.researchGroupExternalId));
        }
        return Promise.all(promises);
      })
      .then((groups) => {
        for (let i = 0; i < invites.length; i++) {
          const invite = invites[i];
          invite.group = groups[i];
        }
        commit('SET_USER_INVITES', invites);
      })
      .finally(() => {
        commit('SET_USER_INVITES_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadUserReviewRequests({ commit }, { username, notify }) {
    const reviewRequests = [];
    return researchContentReviewsService.getReviewRequestsByExpert(username, 'pending')
      .then((results) => {
        const detailsPromises = [];
        reviewRequests.push(...results);
        reviewRequests.forEach((r) => {
          detailsPromises.push(
            researchContentService.getResearchContent(r.researchContentExternalId) // replace with external id
              .then((content) => {
                r.content = content;
                return researchService.getResearch(content.research_external_id);
              }).then((research) => {
                r.research = research;
              })
          );
        });
        return Promise.all(detailsPromises);
      })
      .then(() => usersService.getEnrichedProfiles(reviewRequests.map((r) => r.requestor)))
      .then((users) => {
        const requests = reviewRequests.map((r) => (
          { ...r, requestorProfile: users.find(((u) => u.account.name === r.requestor)) }
        ));
        commit('SET_USER_REVIEW_REQUESTS', requests);
      })
      .finally(() => {
        if (notify) {
          notify();
        }
      });
  },

  // /////////

  denyReviewRequest({ commit, getters }, { reviewRequestId }) {
    const { reviewRequests } = getters;
    const reviewRequestIndex = reviewRequests.findIndex((r) => r._id === reviewRequestId);

    commit('SET_USER_REVIEW_REQUESTS', [
      ...reviewRequests.slice(0, reviewRequestIndex),
      {
        ...reviewRequests[reviewRequestIndex],
        isDenying: true
      },
      ...reviewRequests.slice(reviewRequestIndex + 1)
    ]);
    return researchContentReviewsService.denyReviewRequest(reviewRequestId)
      .then(() => {
        commit('SET_USER_REVIEW_REQUESTS', getters.reviewRequests.filter((r) => r._id !== reviewRequestId));
      });
  },

  updateEciHistoryFilter({ commit, state, getters }, payload) {
    commit('UPDATE_ECI_HISTORY_FILTER', { key: payload.key, value: payload.value });
  },

  loadAccountEciHistoryRecords({ commit }, filter) {
    return expertiseContributionsService.getAccountExpertiseHistory(filter.account, filter)
      .then((history) => {
        commit('SET_ACCOUNT_ECI_HISTORY_BY_DISCIPLINE', history);
      }, (err) => { console.error(err); });
  },

  loadAccountEciStatsRecords({ commit }, filter) {
    return expertiseContributionsService.getAccountExpertiseStats(filter.account, filter)
      .then((stats) => {
        commit('SET_ACCOUNT_ECI_STATS', stats);
      });
  }
};

// mutations
const mutations = {

  SET_USER_ACCOUNT(state, account) {
    state.account = account;
  },

  SET_RESEARCH_GROUPS(state, groups) {
    state.groups = groups;
  },

  SET_EXPERTISE(state, expertise) {
    state.expertise = expertise;
  },

  SET_USER_PROFILE(state, profile) {
    state.profile = profile;
  },

  SET_USER_INVITES(state, invites) {
    state.invites = invites;
  },

  SET_USER_REVIEW_REQUESTS(state, list) {
    state.reviewRequests = list;
  },

  SET_USER_GROUPS_LOADING_STATE(state, value) {
    state.isLoadingUserGroups = value;
  },

  SET_USER_EXPERTISE_LOADING_STATE(state, value) {
    state.isLoadingUserExpertise = value;
  },

  SET_USER_INVITES_LOADING_STATE(state, value) {
    state.isLoadingUserInvites = value;
  },


  SET_RESEARCHES_REFS_DETAILS(state, researchesRef) {
    state.researchesRef = researchesRef;
  },

  SET_RESEARCHES_REFS_DETAILS_LOADING_STATE(state, value) {
    state.isLoadingResearchesRefDetails = value;
  },

  UPDATE_ECI_HISTORY_FILTER(state, { key, value }) {
    state.filter[key] = value;
  },

  SET_ACCOUNT_ECI_STATS(state, stats) { // overview
    Vue.set(state, 'eciStatsByDiscipline', stats);
  },

  RESET_STATE(state) {
    // Vue.set(state, 'eciHistoryByDiscipline', []);
  }

};

const namespaced = true;

export const userDetailsStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
