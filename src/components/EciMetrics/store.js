import $ from 'cheerio';
import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';
import { ResearchService } from '@deip/research-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';

const researchService = ResearchService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const STATE = {
  expertiseHistory: [],
  expertiseStats: [],
  expertiseWidget: [],
};

const GETTERS = {
  expertiseHistory: (state) => { // temp
    const records = state.expertiseHistory;

    return [...records].map((record) => {
      if (record.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.REVIEW) {
        const typeInfo = researchService
          .getResearchContentType(record.research_content.content_type);

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
          actionText: `${typeInfo ? typeInfo.text : 'Publication'} reviewed`,
          meta: {
            title: $(record.review.content)
              .first()
              .text(),
            review: record.review,
            link
          }
        };
      }

      if (record.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT) {
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
            title: $(record.review.content)
              .first()
              .text(),
            review: record.review,
            reviewVote: record.review_vote,
            link
          }
        };
      }

      if (record.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION) {
        const typeInfo = researchService
          .getResearchContentType(record.research_content.content_type);

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
  expertiseStats: (state) => state.expertiseStats
};

const ACTIONS = {
  getDisciplineExpertiseHistory({ commit }, payload) {
    return expertiseContributionsService
      .getDisciplineExpertiseHistory(payload)
      .then((res) => {
        commit('storeExpertiseHistory', res);
      }, (err) => {
        console.error(err);
      });
  },

  getResearchContentExpertiseHistory({ commit }, payload) {
    return expertiseContributionsService
      .getResearchContentExpertiseHistory(payload.external_id, payload.filter)
      .then((res) => {
        commit('storeExpertiseHistory', res);
      }, (err) => {
        console.error(err);
      });
  },

  getResearchExpertiseHistory({ commit }, payload) {
    return expertiseContributionsService
      .getResearchExpertiseHistory(payload.external_id, payload.filter)
      .then((res) => {
        commit('storeExpertiseHistory', res);
      }, (err) => {
        console.error(err);
      });
  },

  getAccountExpertiseHistory({ commit }, payload) {
    return expertiseContributionsService
      .getAccountExpertiseHistory(payload.external_id, payload.filter)
      .then((res) => {
        commit('storeExpertiseHistory', res);
      }, (err) => {
        console.error(err);
      });
  },
  getAccountExpertiseStats({ commit }, payload) {
    return expertiseContributionsService.getAccountExpertiseStats(payload.username, payload.filter)
      .then((res) => {
        commit('storeExpertiseStats', res);
      });
  }
};

const MUTATIONS = {
  storeExpertiseHistory(state, payload) {
    state.expertiseHistory = payload;
  },

  storeExpertiseStats(state, payload) {
    state.expertiseStats = payload;
  }
};

export const eciStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
