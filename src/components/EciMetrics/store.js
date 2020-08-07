import $ from 'cheerio';
import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';
import { ResearchService } from '@deip/research-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import deepmerge from 'deepmerge';

const researchService = ResearchService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const STATE = {
  expertiseHistory: [],
  expertiseHistoryByDisciplines: [],

  expertiseStats: {},
  expertiseStatsByDisciplines: []
};

const statsMethod = (payload) => {
  let serviceMethod;

  if (payload.researchId) {
    serviceMethod = expertiseContributionsService
      .getResearchExpertiseStats(payload.researchId, payload.filter);
  } else if (payload.contentId) {
    serviceMethod = expertiseContributionsService
      .getResearchContentExpertiseStats(payload.contentId, payload.filter);
  } else if (payload.accountName) {
    serviceMethod = expertiseContributionsService
      .getAccountExpertiseStats(payload.accountName, payload.filter);
  } else {
    // serviceMethod = expertiseContributionsService
    //   .getDisciplineExpertiseStats(payload.filter);
  }

  return serviceMethod;
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

  expertiseStats: (state) => state.expertiseStats,
  expertiseStatsByDisciplines: (state) => state.expertiseStatsByDisciplines
};

const ACTIONS = {

  getExpertiseHistory({ commit }, payload) {
    let serviceMethod;

    if (payload.researchId) {
      serviceMethod = expertiseContributionsService
        .getResearchExpertiseHistory(payload.researchId, payload.filter);
    } else if (payload.contentId) {
      serviceMethod = expertiseContributionsService
        .getResearchContentExpertiseHistory(payload.contentId, payload.filter);
    } else if (payload.accountName) {
      serviceMethod = expertiseContributionsService
        .getAccountExpertiseHistory(payload.accountName, payload.filter);
    } else {
      serviceMethod = expertiseContributionsService
        .getDisciplineExpertiseHistory(payload.filter);
    }

    return serviceMethod.then((res) => {
      commit('storeExpertiseHistory', res);
    }, (err) => {
      console.error(err);
    });
  },

  getExpertiseStats({ commit }, payload) {
    return statsMethod(payload)
      .then((res) => {
        commit('storeExpertiseStats', res);
      }, (err) => {
        console.error(err);
      });
  },

  getExpertiseStatsByDisciplines({ commit }, payload) {
    const promises = payload.disciplines.map((d) => {
      const newPayload = deepmerge(
        payload,
        {
          filter: { discipline: d.external_id }
        }
      );

      return statsMethod(newPayload);
    });

    return Promise.all(promises)
      .then((res) => {
        const result = res.map((item, index) => ({
          discipline: payload.disciplines[index],
          ...item
        }));

        commit('storeExpertiseStatsByDisciplines', result);
      }, (err) => {
        console.error(err);
      });
  }

};

const MUTATIONS = {
  storeExpertiseHistory(state, payload) {
    state.expertiseHistory = payload;
  },

  storeExpertiseStats(state, payload) {
    state.expertiseStats = payload;
  },

  storeExpertiseStatsByDisciplines(state, payload) {
    state.expertiseStatsByDisciplines = payload;
  }
};

export const eciStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
