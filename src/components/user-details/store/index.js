import _ from 'lodash';
import deipRpc from '@deip/rpc-client';
import Vue from 'vue';
import moment from 'moment';

import { UsersService } from '@deip/users-service';
import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';
import { ResearchService } from '@deip/research-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';

const usersService = UsersService.getInstance();
const researchContentReviewsService = ResearchContentReviewsService.getInstance();
const researchService = ResearchService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const criteriaTypes = {
  IMPACT: 'Impact',
  NOVELTY: 'Novelty',
  EXCELENCE: 'Excelence',
  RATIONALITY: 'Rationality',
  TECHNICAL_QUALITY: 'Technical Quality',
  REPLICATION: 'Replication'
};

const contributionTypesNamesMap = {
  [EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION]: 'Research',
  [EXPERTISE_CONTRIBUTION_TYPE.REVIEW]: 'Review',
  [EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT]: 'Review support'
};

const state = {
  account: undefined,
  profile: undefined,
  researchList: [],
  groups: [],
  expertise: [],
  invites: [],
  reviewRequests: [],
  researchesRef: [],
  criteriaTypes,
  contributionTypesNamesMap,
  eciHistoryByDiscipline: {},

  filter: {
    criteria: null,
    contributionType: null,
    fromDate: null,
    toDate: null
  },

  isLoadingUserAccount: false,
  isLoadingUserProfile: false,
  isLoadingUserGroups: false,
  isLoadingUserResearch: false,
  isLoadingUserExpertise: false,
  isLoadingUserInvites: false,
  isClaimExpertiseDialogShown: false,
  isLoadingResearchesRefDetails: false
};

// getters
const getters = {
  userInfo: (state, getters) => ({ account: state.account, profile: state.profile }),
  researchList: (state, getters, rootState, rootGetters) => {
    const user = rootGetters['auth/user'];
    return state.researchList.map((research) => {
      const { researchRef } = state.researchesRef.find(({ researchId }) => researchId === research.id);
      const group = state.groups.find(({ id }) => id === research.research_group_id);
      return { research: { ...research, researchRef }, group };
    })
      .filter((item) => !item.research.is_private || item.group.shares.some((share) => share.owner == user.username));
  },

  groups: (state) => state.groups,
  expertise: (state) => state.expertise,
  invites: (state) => state.invites,
  reviewRequests: (state) => state.reviewRequests,

  // TODO: Get rid of this
  criteriaTypes: (state) => state.criteriaTypes,
  criteriaItems: (state) => Object.values(state.criteriaTypes),
  contributionTypesNamesMap: (state) => state.contributionTypesNamesMap,
  contributionTypeItems: (state) => Object.entries(state.contributionTypesNamesMap)
    .map(([key, value]) => ({ text: value, value: key }))
    .filter((e) => e.value != EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION),

  filter: (state) => state.filter,

  eciHistoryByDisciplineMap: (state, getters) => state.eciHistoryByDiscipline,

  eciHistoryByDiscipline: (state, getters) => (disciplineId) => {
    const records = state.eciHistoryByDiscipline[disciplineId];
    if (!records) {
      return null;
    }

    return records
      .filter((record) => {
        if (!getters.filter.contributionType) return true;
        return record.alteration_source_type == getters.filter.contributionType;
      })
      .map((item) => {
        let criteriaModifier;
        switch (getters.filter.criteria) {
          case getters.criteriaTypes.IMPACT:
            criteriaModifier = (y) => y * (0.5 + 0.3 * Math.cos(0.00008 * Math.PI * y));
            break;
          case getters.criteriaTypes.NOVELTY:
            criteriaModifier = (y) => y * (0.3 + 0.2 * Math.sin(0.00008 * Math.PI * y));
            break;
          case getters.criteriaTypes.EXCELENCE:
            criteriaModifier = (y) => y * (0.1 + 0.1 * Math.cos(0.00008 * Math.PI * y));
            break;
          case getters.criteriaTypes.RATIONALITY:
            criteriaModifier = (y) => y * (0.4 + 0.4 * Math.cos(0.00008 * Math.PI * y));
            break;
          case getters.criteriaTypes.TECHNICAL_QUALITY:
            criteriaModifier = (y) => y * (0.7 + 0.5 * Math.sin(0.00008 * Math.PI * y));
            break;
          case getters.criteriaTypes.REPLICATION:
            criteriaModifier = (y) => y * (0.9 + 0.1 * Math.cos(0.00008 * Math.PI * y));
            break;
          default:
            criteriaModifier = (y) => y;
            break;
        }

        const record = { ...item, criteriaEci: criteriaModifier(item.eci) };

        if (record.alteration_source_type == EXPERTISE_CONTRIBUTION_TYPE.REVIEW) {
          const typeInfo = researchService.getResearchContentType(record.research_content.content_type);

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
            actionText: `${typeInfo ? typeInfo.text : 'Publication'} Reviewed`,
            meta: {
              title,
              review: record.review,
              link
            }
          };
        } if (record.alteration_source_type == EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT) {
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
            actionText: 'Review supported',
            meta: {
              title,
              review: record.review,
              reviewVote: record.review_vote,
              link
            }
          };
        } if (record.alteration_source_type == EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION) {
          const typeInfo = researchService.getResearchContentType(record.research_content.content_type);
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
            actionText: `${typeInfo ? typeInfo.text : 'Publication'} uploaded`,
            meta: {
              title: record.research_content.title,
              researchContent: record.research_content,
              link
            }
          };
        }
        return {
          ...record,
          actionText: 'Contribution',
          meta: {
            title: 'Contribution'
          }
        };
      });
  },

  isLoadingUserAccount: (state) => state.isLoadingUserAccount,
  isLoadingUserProfile: (state) => state.isLoadingUserProfile,
  isLoadingUserGroups: (state) => state.isLoadingUserGroups,
  isLoadingUserResearch: (state) => state.isLoadingUserResearch,
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

    return Promise.all([accountLoad, profileLoad, expertiseLoad, invitesLoad, reviewRequestsLoad, groupsLoad])
      .then(() => {
        const researchLoad = new Promise((resolve, reject) => {
          dispatch('loadResearchList', {
            username,
            groupIds: state.groups.map((group) => group.id),
            notify: resolve
          });
        });
        return Promise.all([researchLoad])
          .then(() => {
            const researchesRefLoad = new Promise((resolve, reject) => {
              dispatch('loadResearchesRef', { researchesId: state.researchList.map(({ id }) => id), notify: resolve });
            });
            return Promise.all([researchesRefLoad]);
          });
      });
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
    commit('SET_USER_ACCOUNT_LOADING_STATE', true);

    return deipRpc.api.getAccountsAsync([username])
      .then(([account]) => {
        commit('SET_USER_ACCOUNT', account);
      })
      .finally(() => {
        commit('SET_USER_ACCOUNT_LOADING_STATE', false);
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

  loadResearchList({ commit, state }, { username, groupIds, notify } = {}) {
    commit('SET_USER_RESEARCH_LOADING_STATE', true);
    const researchList = [];
    return Promise.all(groupIds.map((groupId) => deipRpc.api.getResearchesByResearchGroupIdAsync(groupId)))
      .then((data) => {
        const researchPromises = _(data)
          .flatten()
          .map('id')
          .uniq()
          .map((researchId) => deipRpc.api.getResearchByIdAsync(researchId))
          .value();

        return Promise.all(researchPromises);
      })
      .then((researches) => {
        researchList.push(...researches);
        return Promise.all(researchList.map((item) => expertiseContributionsService.getExpertiseContributionsByResearch(item.id)));
      })
      .then((list) => {
        const tvoMap = _.chain(list)
          .flatten()
          .groupBy('research_id')
          .value();

        researchList.forEach((research) => {
          research.totalVotes = tvoMap[research.id] ? tvoMap[research.id] : [];
        });

        commit('SET_RESEARCH_LIST', researchList);
      })
      .finally(() => {
        commit('SET_USER_RESEARCH_LOADING_STATE', false);
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
    commit('SET_USER_PROFILE_LOADING_STATE', true);
    return usersService.getUserProfile(username)
      .then((profile) => {
        commit('SET_USER_PROFILE', profile || null);
      }, (err) => {
        console.log(err);
      }).finally(() => {
        commit('SET_USER_PROFILE_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadUserInvites({ commit }, { username, notify } = {}) {
    commit('SET_USER_INVITES_LOADING_STATE', true);
    const invites = [];
    return deipRpc.api.getResearchGroupInvitesByAccountNameAsync(username)
      .then((list) => {
        const promises = [];
        for (let i = 0; i < list.length; i++) {
          const invite = list[i];
          invites.push(invite);
          promises.push(deipRpc.api.getResearchGroupByIdAsync(invite.research_group_id));
        }
        return Promise.all(promises);
      })
      .then((groups) => {
        for (let i = 0; i < invites.length; i++) {
          const invite = invites[i];
          invite.group = groups.find((g) => g.id === invite.research_group_id);
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

  loadResearchesRef({ state, dispatch, commit }, { researchesId, notify }) {
    commit('SET_RESEARCHES_REFS_DETAILS_LOADING_STATE', true);
    return Promise.all(researchesId.map((id) => researchService.getResearch(id)))
      .then((refs) => {
        const researchesRef = refs.map((researchRef, i) => ({ researchId: researchesId[i], researchRef }));
        commit('SET_RESEARCHES_REFS_DETAILS', researchesRef);
      }, (err) => { console.log(err); })
      .finally(() => {
        commit('SET_RESEARCHES_REFS_DETAILS_LOADING_STATE', false);
        if (notify) notify();
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

  loadAccountEciHistoryRecords({ state, dispatch, commit }, { account, disciplineId, notify }) {
    return expertiseContributionsService.getEciHistoryByAccountAndDiscipline(account, disciplineId)
      .then((records) => {
        commit('SET_ACCOUNT_ECI_HISTORY_BY_DISCIPLINE', { disciplineId, records });
      }, (err) => {
        console.log(err);
      })
      .finally(() => {
        if (notify) notify();
      });
  }
};

// mutations
const mutations = {

  SET_USER_ACCOUNT(state, account) {
    Vue.set(state, 'account', account);
  },

  SET_RESEARCH_LIST(state, researchList) {
    Vue.set(state, 'researchList', researchList);
  },

  SET_RESEARCH_GROUPS(state, groups) {
    Vue.set(state, 'groups', groups);
  },

  SET_EXPERTISE(state, expertise) {
    Vue.set(state, 'expertise', expertise);
  },

  SET_USER_PROFILE(state, profile) {
    Vue.set(state, 'profile', profile);
  },

  SET_USER_INVITES(state, invites) {
    Vue.set(state, 'invites', invites);
  },

  SET_USER_REVIEW_REQUESTS(state, list) {
    Vue.set(state, 'reviewRequests', list);
  },

  SET_USER_ACCOUNT_LOADING_STATE(state, value) {
    state.isLoadingUserAccount = value;
  },

  SET_USER_PROFILE_LOADING_STATE(state, value) {
    state.isLoadingUserProfile = value;
  },

  SET_USER_GROUPS_LOADING_STATE(state, value) {
    state.isLoadingUserGroups = value;
  },

  SET_USER_RESEARCH_LOADING_STATE(state, value) {
    state.isLoadingUserResearch = value;
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
    Vue.set(state, 'researchesRef', researchesRef);
  },

  SET_RESEARCHES_REFS_DETAILS_LOADING_STATE(state, value) {
    state.isLoadingResearchesRefDetails = value;
  },

  SET_ACCOUNT_ECI_HISTORY_BY_DISCIPLINE(state, { disciplineId, records }) {
    Vue.set(state.eciHistoryByDiscipline, disciplineId, records);
  },

  UPDATE_ECI_HISTORY_FILTER(state, { key, value }) {
    Vue.set(state.filter, key, value);
  },

  RESET_STATE(state) {
    Vue.set(state, 'eciHistoryByDiscipline', {});
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
