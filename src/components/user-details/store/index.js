import _ from 'lodash';
import deipRpc from '@deip/deip-oa-rpc-client';
import Vue from 'vue';
import usersService from './../../../services/http/users';
import reviewRequestsService from './../../../services/http/reviewRequests';

const state = {
  account: undefined,
  profile: undefined,
  researchList: [],
  groups: [],
  expertise: [],
  invites: [],
  reviewRequests: [],

  isLoadingUserAccount: false,
  isLoadingUserProfile: false,
  isLoadingUserGroups: false,
  isLoadingUserResearch: false,
  isLoadingUserExpertise: false,
  isLoadingUserInvites: false,
  isClaimExpertiseDialogShown: false
}

// getters
const getters = {
  userInfo: (state, getters) => {
    return { account: state.account, profile: state.profile }
  },
  researchList: state => state.researchList,
  groups: state => state.groups,
  expertise: state => state.expertise,
  invites: state => state.invites,
  reviewRequests: state => state.reviewRequests,

  isLoadingUserAccount: state => state.isLoadingUserAccount,
  isLoadingUserProfile: state => state.isLoadingUserProfile,
  isLoadingUserGroups: state => state.isLoadingUserGroups,
  isLoadingUserResearch: state => state.isLoadingUserResearch,
  isLoadingUserExpertise: state => state.isLoadingUserExpertise,
  isLoadingUserInvites: state => state.isLoadingUserInvites,
  isClaimExpertiseDialogShown: state => state.isClaimExpertiseDialogShown
}

// actions
const actions = {

  loadUserDetailsPage({ state, dispatch, commit, rootGetters }, { username }) {
    const currentUser = rootGetters['auth/user'];
    const isMyPage = currentUser.username == username;

    const accountLoad = new Promise((resolve, reject) => {
      dispatch('loadUserAccount', { username: username, notify: resolve });
    });
    const profileLoad = new Promise((resolve, reject) => {
      dispatch('loadUserProfile', { username: username, notify: resolve });
    });
    const expertiseLoad = new Promise((resolve, reject) => {
      dispatch('loadExpertise', { username: username, notify: resolve });
    });
    const invitesLoad = isMyPage ? new Promise((resolve, reject) => {
        dispatch('loadUserInvites', { username, notify: resolve }) 
    }) : Promise.resolve();
    
    const reviewRequestsLoad = isMyPage ? new Promise((resolve, reject) => {
      dispatch('loadUserReviewRequests', { username: username, notify: resolve });
    }) : Promise.resolve();

    const groupsLoad = new Promise((resolve, reject) => {
      dispatch('loadGroups', { username: username, notify: resolve });
    });

    return Promise.all([accountLoad, profileLoad, expertiseLoad, invitesLoad, reviewRequestsLoad, groupsLoad])
      .then(() => {
        const researchLoad = new Promise((resolve, reject) => {
          dispatch('loadResearchList', { username: username, groupIds: state.groups.map(group => group.id), notify: resolve });
        });
        return Promise.all([researchLoad]);
      });
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
      .then(data => {
        let groupsInfo = Promise.all(
          data.map(groupToken => deipRpc.api.getResearchGroupByIdAsync(groupToken.research_group_id))
        );

        let groupsShares = Promise.all(
          data.map(groupToken => deipRpc.api.getResearchGroupTokensByResearchGroupAsync(groupToken.research_group_id))
        );

        return Promise.all([groupsInfo, groupsShares]);
      })
      .then(([groupsInfo, groupsShares]) => {
        return _.each(groupsInfo, (item, i) => { item.shares = groupsShares[i] });
      })
      .then((groups) => {
        commit('SET_RESEARCH_GROUPS', groups);
      })
      .finally(() => {
        commit('SET_USER_GROUPS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadResearchList({ commit, state }, { username, groupIds, notify } = {}) {
    commit('SET_USER_RESEARCH_LOADING_STATE', true)
    const researchList = [];
    return Promise.all(groupIds.map(groupId => deipRpc.api.getResearchesByResearchGroupIdAsync(groupId)))
      .then(data => {
        let researchPromises = _(data)
          .flatten()
          .map('id')
          .uniq()
          .map(researchId => deipRpc.api.getResearchByIdAsync(researchId))
          .value();

        return Promise.all(researchPromises);
      })
      .then(researches => {
        researchList.push(...researches);
        return Promise.all(researchList.map(item => deipRpc.api.getTotalVotesByResearchAsync(item.id)));
      })
      .then(list => {
        let tvoMap = _.chain(list)
          .flatten()
          .groupBy('research_id')
          .value();

        researchList.forEach(research => {
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
    commit('SET_USER_EXPERTISE_LOADING_STATE', true)
    return deipRpc.api.getExpertTokensByAccountNameAsync(username)
      .then(data => {
        commit('SET_EXPERTISE', data);
      }).finally(() => {
        commit('SET_USER_EXPERTISE_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadUserProfile({ commit }, { username, notify } = {}) {
    commit('SET_USER_PROFILE_LOADING_STATE', true);
    return usersService.getUserProfile(username)
      .then(profile => {
        commit('SET_USER_PROFILE', profile || null);
      }, (err) => {
        console.log(err)
      }).finally(() => {
        commit('SET_USER_PROFILE_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadUserInvites({ commit }, { username, notify } = {}) {
    commit('SET_USER_INVITES_LOADING_STATE', true)
    const invites = [];
    return deipRpc.api.getResearchGroupInvitesByAccountNameAsync(username)
      .then(list => {
        const promises = [];
        for (let i = 0; i < list.length; i++) {
          const invite = list[i];
          invites.push(invite);
          promises.push(deipRpc.api.getResearchGroupByIdAsync(invite.research_group_id))
        }
        return Promise.all(promises);
      })
      .then(groups => {
        for (let i = 0; i < invites.length; i++) {
          const invite = invites[i];
          invite.group = groups.find(g => g.id === invite.research_group_id)
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
    return reviewRequestsService.getReviewRequestsByExpert(username)
      .then((results) => {
        const detailsPromises = [];
        reviewRequests.push(...results);
        reviewRequests.forEach((r) => {
          detailsPromises.push(
            deipRpc.api.getResearchContentByIdAsync(r.contentId)
              .then((content) => {
                r.content = content;
                return deipRpc.api.getResearchByIdAsync(content.research_id);
              }).then(research => r.research = research)
          );
        })
        return Promise.all(detailsPromises);
      }).then(() => {
        commit('SET_USER_REVIEW_REQUESTS', reviewRequests)
      }).finally(() => {
        if (notify) {
          notify();
        }
      })
  },

  denyReviewRequest({ commit, getters }, { reviewRequestId }) {
    const reviewRequests = getters.reviewRequests;
    const reviewRequestIndex = reviewRequests.findIndex((r) => r._id === reviewRequestId);

    commit('SET_USER_REVIEW_REQUESTS', [
      ...reviewRequests.slice(0, reviewRequestIndex),
      {
        ...reviewRequests[reviewRequestIndex],
        isDenying: true
      },
      ...reviewRequests.slice(reviewRequestIndex + 1)
    ]);
    return reviewRequestsService.denyReviewRequest(reviewRequestId)
      .then(() => {
        commit('SET_USER_REVIEW_REQUESTS', getters.reviewRequests.filter(r => r._id !== reviewRequestId));
      })
  },

  openExpertiseTokensClaimDialog({ commit }) {
    commit('SET_EXPERTISE_TOKENS_CLAIM_DIALOG_VISIBILITY_STATE', true);
  },

  closeExpertiseTokensClaimDialog({ commit }) {
    commit('SET_EXPERTISE_TOKENS_CLAIM_DIALOG_VISIBILITY_STATE', false);
  }
}

// mutations
const mutations = {

  ['SET_USER_ACCOUNT'](state, account) {
    Vue.set(state, 'account', account);
  },

  ['SET_RESEARCH_LIST'](state, researchList) {
    Vue.set(state, 'researchList', researchList);
  },

  ['SET_RESEARCH_GROUPS'](state, groups) {
    Vue.set(state, 'groups', groups);
  },

  ['SET_EXPERTISE'](state, expertise) {
    Vue.set(state, 'expertise', expertise);
  },

  ['SET_USER_PROFILE'](state, profile) {
    Vue.set(state, 'profile', profile);
  },

  ['SET_USER_INVITES'](state, invites) {
    Vue.set(state, 'invites', invites);
  },

  ['SET_USER_REVIEW_REQUESTS'](state, list) {
    Vue.set(state, 'reviewRequests', list);
  },

  ['SET_USER_ACCOUNT_LOADING_STATE'](state, value) {
    state.isLoadingUserAccount = value;
  },

  ['SET_USER_PROFILE_LOADING_STATE'](state, value) {
    state.isLoadingUserProfile = value;
  },

  ['SET_USER_GROUPS_LOADING_STATE'](state, value) {
    state.isLoadingUserGroups = value;
  },

  ['SET_USER_RESEARCH_LOADING_STATE'](state, value) {
    state.isLoadingUserResearch = value;
  },

  ['SET_USER_EXPERTISE_LOADING_STATE'](state, value) {
    state.isLoadingUserExpertise = value;
  },

  ['SET_USER_INVITES_LOADING_STATE'](state, value) {
    state.isLoadingUserInvites = value;
  },

  ['SET_EXPERTISE_TOKENS_CLAIM_DIALOG_VISIBILITY_STATE'](state, value) {
    state.isClaimExpertiseDialogShown = value;
  }
}

const namespaced = true;

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}