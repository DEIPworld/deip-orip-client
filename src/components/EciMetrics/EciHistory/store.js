import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';
import { ResearchContentService } from '@deip/research-content-service';

const researchContentService = ResearchContentService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();

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
    let expertises = [];
    return historyMethod(payload)
      .then((res) => {
        expertises = [...res];
        return Promise.all(expertises.reduce((arr, e) => {
          if (e.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION
            || e.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.REVIEW
            || e.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT
          ) {
            return [
              ...arr, researchContentService.getResearchContent(e.research_content.external_id)
            ];
          }
          return arr;
        }, []));
      })
      .then((res) => {
        expertises = expertises.map((e) => {
          if (e.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION) {
            const exp = res.find((r) => r.external_id === e.research_content.external_id);
            e.research_content.title = exp ? exp.title : '';
            return e;
          }
          if (e.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.REVIEW
            || e.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT) {
            const exp = res.find((r) => r.external_id === e.research_content.external_id);
            e.review.contentRef = exp ? exp.title : '';
            return e;
          }
          return e;
        });
        commit('storeExpertiseHistory', expertises);
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const GETTERS = {
  expertiseHistory: (state) => { // temp
    const records = state.expertiseHistory;

    return [...records].map((record) => {
      if (record.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.REVIEW) {
        const typeInfo = researchContentService
          .getResearchContentType(record.research_content.content_type);

        const link = {
          name: 'project.content.review.details',
          params: {
            projectId: record.research.external_id,
            contentId: record.research_content.external_id,
            reviewId: record.review.external_id
          }
        };

        return {
          ...record,
          actionText: `${typeInfo ? typeInfo.text : 'Publication'} reviewed`,
          meta: {
            title: record.review.contentRef,
            review: record.review,
            link
          }
        };
      }

      if (record.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT) {
        const link = {
          name: 'project.content.review.details',
          params: {
            projectId: record.research.external_id,
            contentId: record.research_content.external_id,
            reviewId: record.review.external_id
          }
        };

        return {
          ...record,
          actionText: 'Review supported',
          meta: {
            title: record.review.contentRef,
            review: record.review,
            reviewVote: record.review_vote,
            link
          }
        };
      }

      if (record.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION) {
        const typeInfo = researchContentService
          .getResearchContentType(record.research_content.content_type);

        const link = {
          name: 'project.content.details',
          params: {
            projectId: record.research.external_id,
            contentId: record.research_content.external_id
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
