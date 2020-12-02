import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { ResearchService } from '@deip/research-service';
import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';
import $ from 'cheerio';

const expertiseContributionsService = ExpertiseContributionsService.getInstance();
const researchService = ResearchService.getInstance();

const historyMethod = (payload) => {
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

  return serviceMethod;
};

const STATE = {
  expertiseHistory: []
};

const ACTIONS = {
  getExpertiseHistory({ commit }, payload) {
    return historyMethod(payload).then((res) => {
      commit('storeExpertiseHistory', res);
    }, (err) => {
      console.error(err);
    });
  }
};

const GETTERS = {
  expertiseHistory: (state) => { // temp
    const records = state.expertiseHistory;

    return [...records].map((record) => {
      if (record.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.REVIEW) {
        const typeInfo = researchService
          .getResearchContentType(record.research_content.content_type);

        const link = {
          name: 'project.content.review.details',
          params: {
            researchExternalId: record.research.external_id,
            contentExternalId: record.research_content.external_id,
            reviewExternalId: record.review.external_id
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
          name: 'project.content.review.details',
          params: {
            researchExternalId: record.research.external_id,
            contentExternalId: record.research_content.external_id,
            reviewExternalId: record.review.external_id
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
          name: 'project.content.details',
          params: {
            researchExternalId: record.research.external_id,
            contentExternalId: record.research_content.external_id
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
  }
};

const MUTATIONS = {
  storeExpertiseHistory(state, payload) {
    state.expertiseHistory = payload;
  }
};

export const eciHistoryStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
