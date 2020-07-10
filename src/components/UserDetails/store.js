import _ from 'lodash';
import deipRpc from '@deip/rpc-client';
import Vue from 'vue';
import moment from 'moment';

import { UsersService } from '@deip/users-service';
import { UserService } from '@deip/user-service';
import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';
import { ResearchService } from '@deip/research-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';

const userService = UserService.getInstance();
const usersService = UsersService.getInstance();
const researchContentReviewsService = ResearchContentReviewsService.getInstance();
const researchService = ResearchService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const state = {
  account: undefined,
  profile: undefined,
  researchList: [],
  groups: [],
  expertise: [],
  invites: [],
  reviewRequests: [],
  researchesRef: [],
  eciStatsByDiscipline: undefined,
  eciHistoryByDiscipline: [],

  filter: {
    criteria: null,
    contributionType: null,
    fromDate: null,
    toDate: null
  },

  isLoadingUserGroups: false,
  isLoadingUserExpertise: false,
  isLoadingUserInvites: false,
  isClaimExpertiseDialogShown: false,
  isLoadingResearchesRefDetails: false
};

// getters
const getters = {
  userInfo: (state, getters) => ({ account: state.account, profile: state.profile }),
  researchList: (state, getters, rootState, rootGetters) => {
    return state.researchList.map((research) => {
      const group = state.groups.find(({ id }) => id === research.research_group_id);
      return { research: { ...research }, group };
    });
  },

  groups: (state) => state.groups,
  expertise: (state) => state.expertise,
  invites: (state) => state.invites,
  reviewRequests: (state) => state.reviewRequests,

  filter: (state) => state.filter,
  eciStatsByDiscipline: (state, getters) => state.eciStatsByDiscipline,
  eciHistoryByDiscipline: (state, getters) => {

    return state.eciHistoryByDiscipline
      .map((item) => {

        const getEciRecordLabel = (record) => {
          let actionText = "";
          const isSideEvent = !(record.contribution_type == record.event_contribution_type && record.contribution_id == record.event_contribution_id);

          switch (record.contribution_type) {
            case EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION:
              let materialTypeInfo = researchService.getResearchContentType(record.research_content.content_type);
              if (isSideEvent) {
                actionText = `${materialTypeInfo ? materialTypeInfo.text : 'Material'} rewarded`;
              } else {
                actionText = `${materialTypeInfo ? materialTypeInfo.text : 'Material'} uploaded`;
              }
              break;
            case EXPERTISE_CONTRIBUTION_TYPE.REVIEW:
              let reviewedMaterialTypeInfo = researchService.getResearchContentType(record.research_content.content_type);
              if (isSideEvent) {
                actionText = `Review rewarded`;
              } else {
                actionText = `${reviewedMaterialTypeInfo ? reviewedMaterialTypeInfo.text : 'Material'} reviewed`;
              }
              break;
            case EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT:
              if (isSideEvent) {
                actionText = `Support rewarded`;
              } else {
                actionText = `Review supported`;
              }
              break;
            default:
              actionText = `Reward`;
              break;
          }

          return actionText;
        };

        const record = { ...item };

        if (record.contribution_type == EXPERTISE_CONTRIBUTION_TYPE.REVIEW) {
          const parser = new DOMParser();
          const html = parser.parseFromString(record.review.content, 'text/html');
          const allElements = Array.from(html.all);
          const bodyIdx = allElements.findIndex((el) => el.tagName == 'BODY');
          const headerEl = allElements[bodyIdx + 1];
          const title = headerEl.innerHTML;

          const link = {
            name: 'ResearchContentReview',
            params: {
              research_group_permlink: decodeURIComponent(record.research_group.permlink),
              research_permlink: decodeURIComponent(record.research.permlink),
              content_permlink: decodeURIComponent(record.research_content.permlink),
              review_id: record.review.id
            }
          };

          return {
            ...record,
            actionText: getEciRecordLabel(record),
            meta: {
              title,
              review: record.review,
              link
            }
          };
        } else if (record.contribution_type == EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT) {
          const parser = new DOMParser();
          const html = parser.parseFromString(record.review.content, 'text/html');
          const allElements = Array.from(html.all);
          const bodyIdx = allElements.findIndex((el) => el.tagName == 'BODY');
          const headerEl = allElements[bodyIdx + 1];
          const title = headerEl.innerHTML;

          const link = {
            name: 'ResearchContentReview',
            params: {
              research_group_permlink: decodeURIComponent(record.research_group.permlink),
              research_permlink: decodeURIComponent(record.research.permlink),
              content_permlink: decodeURIComponent(record.research_content.permlink),
              review_id: record.review.id
            }
          };

          return {
            ...record,
            actionText: getEciRecordLabel(record),
            meta: {
              title,
              review: record.review,
              reviewVote: record.review_vote,
              link
            }
          };
        } else if (record.contribution_type == EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION) {
          const link = {
            name: 'ResearchContentDetails',
            params: {
              research_group_permlink: decodeURIComponent(record.research_group.permlink),
              research_permlink: decodeURIComponent(record.research.permlink),
              content_permlink: decodeURIComponent(record.research_content.permlink)
            }
          };

          return {
            ...record,
            actionText: getEciRecordLabel(record),
            meta: {
              title: record.research_content.title,
              researchContent: record.research_content,
              link
            }
          };
        } else {
          return {
            ...record,
            actionText: 'Graduation',
            meta: {
              title: 'Certified expert'
            }
          };
        }
      });
  },

  isLoadingUserGroups: (state) => state.isLoadingUserGroups,
  isLoadingUserExpertise: (state) => state.isLoadingUserExpertise,
  isLoadingUserInvites: (state) => state.isLoadingUserInvites,
  isClaimExpertiseDialogShown: (state) => state.isClaimExpertiseDialogShown
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

    const researchesLoad = new Promise((resolve, reject) => {
      dispatch('loadResearchList', { username, notify: resolve });
    });

    return Promise.all([
      accountLoad,
      profileLoad,
      expertiseLoad,
      invitesLoad,
      reviewRequestsLoad,
      groupsLoad,
      researchesLoad
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
          data.map((groupToken) => deipRpc.api.getResearchGroupByIdAsync(groupToken.research_group_id))
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


  loadResearchList({ commit, state }, { username, notify } = {}) {
    return researchService.getUserResearchListing(username)
      .then((researches) => {
        commit('SET_RESEARCH_LIST', researches);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadExpertise({ commit }, { username, notify } = {}) {
    commit('SET_USER_EXPERTISE_LOADING_STATE', true);
    return deipRpc.api.getExpertTokensByAccountNameAsync(username)
      .then((data) => {
        commit('SET_EXPERTISE', data);
      }).finally(() => {
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
          promises.push(deipRpc.api.getResearchGroupAsync(invite.researchGroupExternalId));
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
            deipRpc.api.getResearchContentByIdAsync(r.contentId)
              .then((content) => {
                r.content = content;
                return deipRpc.api.getResearchByIdAsync(content.research_id);
              }).then((research) => r.research = research)
          );
        });
        return Promise.all(detailsPromises);
      })
      .then(() => usersService.getEnrichedProfiles(reviewRequests.map((r) => r.requestor)))
      .then((users) => {
        const requests = reviewRequests.map((r, i) => ({ ...r, requestorProfile: users[i] }));
        commit('SET_USER_REVIEW_REQUESTS', requests);
      })
      .finally(() => {
        if (notify) {
          notify();
        }
      });
  },

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

  openExpertiseTokensClaimDialog({ commit }) {
    commit('SET_EXPERTISE_TOKENS_CLAIM_DIALOG_VISIBILITY_STATE', true);
  },

  closeExpertiseTokensClaimDialog({ commit }) {
    commit('SET_EXPERTISE_TOKENS_CLAIM_DIALOG_VISIBILITY_STATE', false);
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

  SET_RESEARCH_LIST(state, researchList) {
    state.researchList = researchList;
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

  SET_EXPERTISE_TOKENS_CLAIM_DIALOG_VISIBILITY_STATE(state, value) {
    state.isClaimExpertiseDialogShown = value;
  },

  SET_RESEARCHES_REFS_DETAILS(state, researchesRef) {
    state.researchesRef = researchesRef;
  },

  SET_RESEARCHES_REFS_DETAILS_LOADING_STATE(state, value) {
    state.isLoadingResearchesRefDetails = value;
  },

  SET_ACCOUNT_ECI_HISTORY_BY_DISCIPLINE(state, history) {
    Vue.set(state, 'eciHistoryByDiscipline', history);
  },

  UPDATE_ECI_HISTORY_FILTER(state, { key, value }) {
    state.filter[key] = value;
  },

  SET_ACCOUNT_ECI_STATS(state, stats) {
    Vue.set(state, 'eciStatsByDiscipline', stats);
  },

  RESET_STATE(state) {
    Vue.set(state, 'eciHistoryByDiscipline', []);
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
