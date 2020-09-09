import deipRpc from '@deip/rpc-client';
import { ResearchService } from '@deip/research-service';
import { AccessService } from '@deip/access-service';
import { UsersService } from '@deip/users-service';
import { InvestmentsService } from '@deip/investments-service';
import { ResearchContentService } from '@deip/research-content-service';
import { GrantsService } from '@deip/grants-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import _ from 'lodash';

const accessService = AccessService.getInstance();
const researchService = ResearchService.getInstance();
const usersService = UsersService.getInstance();
const investmentsService = InvestmentsService.getInstance();
const researchContentService = ResearchContentService.getInstance();
const grantsService = GrantsService.getInstance();

const STATE = {
  data: {},
  contents: [],
  members: [],
  reviews: [],
  // researchRef: null,
  // group: null,
  // applicationsList: [],

  disciplines: [],
  // tokenSale: undefined,
  // tokenSalesList: [],
  // tokenHoldersList: [],
  // contributionsList: [],
  // groupInvitesList: [],
  // applicationsRefsList: [],
  // userContributionsList: [],
  experts: [],
  // researchEciStatsRecords: null
};

const GETTERS = {

  data: (state) => state.data,
  contents: (state) => state.contents,
  members: (state) => state.members,
  // researchRef: (state, getters) => state.research.researchRef,
  //
  // group: (state) => state.group,
  //

  //
  // draftsList: (state, getters) => state.allContentsList
  //   .filter((researchContent) => researchContent.isDraft)
  //   .map((researchContent) => ({ ...researchContent.researchContentRef })),
  //
  // applicationsList: (state, getters) => state.applicationsList,
  //
  //
  //
  // researchMembersList: (state, getters) => state.researchGroupMembersList
  //   .filter((member) => state.research.members.some((m) => m == member.account.name)),
  //
  reviews: (state, getters) => state.reviews.map((review, i) => {
    const researchContent = getters.contents.find((content) => content.id === review.research_content_id);
    return {
      ...review,
      researchContent
    };
  })
    .sort((a, b) => b.id - a.id),
  //
  disciplines: (state, getters) => state.disciplines,
  //
  // tokenSale: (state, getters) => state.tokenSale,
  //
  // tokenSalesList: (state, getters) => state.tokenSalesList,
  //
  // tokenHoldersList: (state, getters) => state.tokenHoldersList,
  //
  // contributionsList: (state, getters) => state.contributionsList,
  //
  // groupInvitesList: (state, getters) => state.groupInvitesList,
  //
  // researchEciStatsRecords: (state) => state.researchEciStatsRecords,
  //
  experts: (state, getters) => state.experts,
  //
  // isLoadingResearchContent: (state, getters) => state.isLoadingResearchContent,
  //
  // isLoadingResearchMembers: (state, getters) => state.isLoadingResearchMembers,
  //
  // isLoadingResearchDetails: (state, getters) => state.isLoadingResearchDetails,
  //
  // isLoadingResearchReviews: (state, getters) => state.isLoadingResearchReviews,
  //
  // isLoadingResearchDisciplines: (state, getters) => state.isLoadingResearchDisciplines,
  //
  // isLoadingResearchTokenHolders: (state, getters) => state.isLoadingResearchTokenHolders,
  //
  // isLoadingResearchTokenSale: (state, getters) => state.isLoadingResearchTokenSale,
  //
  // isLoadingResearchContentRefs: (state, getters) => state.isLoadingResearchContentRefs,
  //
  // timelineOffsets(state, getters) {
  //   if (state.research !== null && getters.contentList !== null
  //     && getters.contentList.length !== 0) {
  //     const startTimestamp = Date.parse(state.research.created_at);
  //     const endTimestamp = Date.parse(getters.contentList[getters.contentList.length - 1].created_at);
  //     const allTime = endTimestamp - startTimestamp;
  //
  //     const offsets = [];
  //     // the end of timeline can be reached for finished research only
  //     const maxRatio = state.research.is_finished ? 100 : 70;
  //     for (let i = 0; i < getters.contentList.length; i++) {
  //       const contentTimestamp = Date.parse(getters.contentList[i].created_at);
  //
  //       // calculate item ratio by its index
  //       const indexFactor = (i + 1) / getters.contentList.length * maxRatio;
  //
  //       // calculate item ratio by its timestamp
  //       var timestampFactor;
  //       if (allTime === 0) {
  //         // all research content have been posted at the same time (genesis)
  //         timestampFactor = i == getters.contentList.length - 1 ? maxRatio : 50;
  //       } else {
  //         const timeAfter = endTimestamp - contentTimestamp;
  //         timestampFactor = 100 - (timeAfter / allTime * 100) || 1;
  //       }
  //
  //       // adjust position relative to entire timeline period
  //       const ratio = (indexFactor * timestampFactor) / 100;
  //       offsets.push({ value: ratio.toFixed(2) });
  //     }
  //
  //     return offsets;
  //   }
  //   return [];
  // },
  //
  // userContributionsList: (state, getters) => state.userContributionsList

};

const ACTIONS = {
  getResearch({ state, dispatch }, researchExternalId) {
    return dispatch('getResearchDetails', researchExternalId)
      .then(() => {
        const research = { ...state.data };

        return Promise.all([
          dispatch('getResearchContents', research.external_id),
          dispatch('getResearchMembers', research.research_group_id),
          dispatch('getResearchReviews', research.external_id),
          dispatch('getResearchDisciplines', research.id),
          // dispatch('getResearchTokenHolders', research.id),
          // dispatch('getResearchTokenSale', research.id),
          // dispatch('getResearchTokenSales', research.id),
          // dispatch('getResearchGroupDetails', research.research_group_id),
          // dispatch('getResearchApplications', research.id),
          // dispatch('getUserContributions', research.id)
        ]);
      });
  },

  getResearchDetails({ commit }, researchExternalId) {
    return researchService.getResearch(researchExternalId)
      .then((res) => {
        commit('storeResearchData', res);
      });
  },

  getResearchContents({ commit }, researchExternalId) {
    const researchContents = [];

    return researchContentService.getResearchContentByResearch(researchExternalId)
      .then((list) => {
        researchContents.push(...list);
        return Promise.all(
          researchContents.map((content) => deipRpc.api.getReviewsByResearchContentAsync(content.external_id))
        );
      })
      .then((reviews) => {
        researchContents.forEach((content, index) => {
          content.reviews = reviews[index];
        });

        commit('storeResearchContents', researchContents);
      })
      .catch((err) => { console.error(err); });
  },

  // getResearchApplications({ commit }, researchId) {
  //   let applications = [];
  //
  //   deipRpc.api.getGrantApplicationsByResearchIdAsync(researchId)
  //     .then((list) => {
  //       applications = list;
  //       return Promise.all(applications.map((a) => deipRpc.api.getFundingOpportunityAsync(a.grant_id)));
  //     })
  //     .then((foaList) => {
  //       for (let i = 0; i < applications.length; i++) {
  //         const application = applications[i];
  //         application.foa = foaList[i];
  //         const hashes = application.application_hash.split(':');
  //         application.letterHash = hashes[0];
  //         application.packageHash = hashes[1];
  //       }
  //       commit('storeResearchApplications', applications);
  //     })
  //     .catch((err) => { console.error(err); });
  // },

  getResearchMembers({ commit }, groupId) {
    const rgtList = [];
    deipRpc.api.getResearchGroupTokensByResearchGroupAsync(groupId)
      .then((members) => {
        rgtList.push(...members);
        return usersService.getEnrichedProfiles(members.map((m) => m.owner));
      }, (err) => { console.error(err); })
      .then((users) => {
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          user.rgt = rgtList.find((rgt) => rgt.owner === user.account.name);
        }
        commit('storeResearchMembers', users);
      }, (err) => { console.error(err); });
  },

  getResearchReviews({ commit }, researchExternalId) {
    const reviews = [];

    deipRpc.api.getReviewsByResearchAsync(researchExternalId)
      .then((items) => {
        reviews.push(...items);
        return Promise.all([
          Promise.all(reviews.map((item) => deipRpc.api.getReviewVotesByReviewIdAsync(item.id))),
          usersService.getEnrichedProfiles(reviews.map((r) => r.author))
        ]);
      }, (err) => { console.error(err); })
      .then(([reviewVotes, users]) => {
        reviews.forEach((review, i) => {
          review.author = users.find((u) => u.account.name === review.author);
          review.votes = reviewVotes[i];
          review.supporters = reviewVotes[i].reduce((arr, vote) => (arr.some(({ voter }) => voter === vote.voter) ? arr : [...arr, vote]), []);
        });
        console.log(reviews)
        commit('storeResearchReviews', reviews);
      }, (err) => { console.error(err); });
  },

  getResearchDisciplines({ commit }, researchId) {
    const disciplinesList = [];

    deipRpc.api.getDisciplinesByResearchAsync(researchId)
      .then((data) => {
        const expertsPromises = [];
        for (let i = 0; i < data.length; i++) {
          const discipline = data[i];
          disciplinesList.push(discipline);
          expertsPromises.push(deipRpc.api.getExpertTokensByDisciplineAsync(discipline.external_id));
        }
        return Promise.all([
          Promise.all(expertsPromises)
        ]);
      }, (err) => { console.error(err); })
      .then(([expertTokensPerDiscipline]) => {
        const expertsAccountNames = [];
        expertTokensPerDiscipline.forEach((e) => {
          expertsAccountNames.push(...e.map((et) => et.account_name));
        });
        commit('storeResearchDisciplines', disciplinesList);
        return usersService.getEnrichedProfiles(_.uniq(expertsAccountNames));
      }, (err) => { console.error(err); })
      .then((expertsList) => {
        commit('storeExperts', expertsList);
      });
  },

  // getResearchTokenHolders({ commit }, researchId) {
  //   const tokenHolders = [];
  //   deipRpc.api.getResearchTokensByResearchIdAsync(researchId)
  //     .then((rtList) => {
  //       tokenHolders.push(...rtList);
  //       return usersService.getEnrichedProfiles(tokenHolders.map((m) => m.account_name));
  //     }, (err) => { console.error(err); })
  //     .then((users) => {
  //       for (let i = 0; i < tokenHolders.length; i++) {
  //         const holder = tokenHolders[i];
  //         holder.user = users.find((user) => holder.account_name === user.account.name);
  //       }
  //       commit('storeResearchTokenHolders', tokenHolders);
  //     });
  // },
  //
  // getResearchTokenSale({ commit, dispatch }, researchId) {
  //   return investmentsService.getCurrentTokenSaleByResearchId(researchId)
  //     .then((tokenSale) => {
  //       commit('storeResearchTokenSale', tokenSale);
  //
  //       if (tokenSale) {
  //         return dispatch('getTokenSaleContributors');
  //       }
  //       commit('storeResearchTokenSaleContributions', []);
  //     }, (err) => { console.error(err); });
  // },
  //
  // getResearchTokenSales({ commit }, researchId) {
  //   return deipRpc.api.getResearchTokenSalesByResearchIdAsync(researchId)
  //     .then((tokenSales) => {
  //       commit('storeResearchTokenSales', tokenSales);
  //     }, (err) => { console.error(err); });
  // },
  //
  // getTokenSaleContributors({ state, commit }) {
  //   const contributors = [];
  //   return deipRpc.api.getResearchTokenSaleContributionsByResearchTokenSaleIdAsync(state.tokenSale.id)
  //     .then((contributions) => {
  //       contributors.push(...contributions);
  //       return usersService.getEnrichedProfiles(contributions.map((m) => m.owner));
  //     })
  //     .then((users) => {
  //       for (let i = 0; i < contributors.length; i++) {
  //         const contributor = contributors[i];
  //         contributor.user = users.find((user) => contributor.owner === user.account.name);
  //       }
  //       commit('storeResearchTokenSaleContributions', contributors);
  //     });
  // },
  //
  // // TODO: fix
  // getResearchGroupDetails({ commit }, groupId) {
  //   deipRpc.api.getResearchGroupByIdAsync(groupId)
  //     .then((group) => {
  //       commit('storeResearchGroupDetails', group);
  //     }, (err) => { console.error(err); });
  // },
  //
  // getUserContributions({ commit, rootGetters }, researchId) {
  //   const user = rootGetters['auth/user'];
  //   return !accessService.isLoggedIn()
  //     ? Promise.resolve()
  //     : deipRpc.api.getContributionsHistoryByContributorAndResearchAsync(user.account.name, researchId)
  //       .then((hist) => {
  //         const contributions = hist.map((h) => ({
  //           tokenSaleId: h.op[1].research_token_sale_id,
  //           amount: h.op[1].amount
  //         }));
  //         commit('storeUserContributions', contributions);
  //       });
  // }
};

const MUTATIONS = {
  storeResearchData(state, research) {
    state.data = research;
  },
  storeResearchContents(state, list) {
    state.contents = list;
  },

  storeResearchMembers(state, list) {
    state.members = list;
  },
  //
  // storeResearchApplications(state, applications) {
  //   state.applicationsList = applications;
  // },
  //
  storeResearchReviews(state, list) {
    state.reviews = list;
  },
  //
  storeResearchDisciplines(state, list) {
    state.disciplinesList = list;
  },
  //
  // storeResearchTokenSale(state, tokenSale) {
  //   state.tokenSale = tokenSale;
  // },
  //
  // storeResearchTokenSales(state, list) {
  //   state.tokenSalesList = list;
  // },
  //
  // storeResearchTokenHolders(state, tokenHolders) {
  //   state.tokenHoldersList = tokenHolders;
  // },
  //
  // storeResearchTokenSaleContributions(state, contributions) {
  //   state.contributionsList = contributions;
  // },
  //
  // storeResearchGroupInvites(state, invites) {
  //   state.groupInvitesList = invites;
  // },
  //
  // storeResearchApplicationsRefs(state, refs) {
  //   state.applicationsRefsList = refs;
  // },
  //
  // storeUserContributions(state, list) {
  //   state.userContributionsList = list;
  // },
  //
  storeExperts(state, list) {
    state.expertsList = list;
  },
  //
  // storeResearchGroupDetails(state, value) {
  //   state.group = value;
  // },
};

export const researchStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
