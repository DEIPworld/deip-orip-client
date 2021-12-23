import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';
import { ProjectContentService } from '@deip/project-content-service';

const projectContentService = ProjectContentService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const historyMethod = (payload) => {
  let serviceMethod;

  if (payload.projectId) {
    serviceMethod = expertiseContributionsService
      .getProjectExpertiseHistory(payload.projectId, payload.filter);
  } else if (payload.contentId) {
    serviceMethod = expertiseContributionsService
      .getProjectContentExpertiseHistory(payload.contentId, payload.filter);
  } else if (payload.accountName) {
    serviceMethod = expertiseContributionsService
      .getAccountExpertiseHistory(payload.accountName, payload.filter);
  } else {
    serviceMethod = expertiseContributionsService
      .getDomainExpertiseHistory(payload.filter);
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
              ...arr, projectContentService.getProjectContent(e.projectContent._id)
            ];
          }
          return arr;
        }, []));
      })
      .then((res) => {
        expertises = expertises.map((e) => {
          if (e.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION) {
            const exp = res.find((r) => r._id === e.projectContent._id);
            e.projectContent.title = exp ? exp.title : '';
            return e;
          }
          if (e.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.REVIEW
            || e.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT) {
            const exp = res.find((r) => r._id === e.projectContent._id);
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
        const typeInfo = projectContentService
          .getProjectContentType(record.projectContent.content_type);

        const link = {
          name: 'project.content.review.details',
          params: {
            projectId: record.project._id,
            contentId: record.projectContent._id,
            reviewId: record.review._id
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
            projectId: record.project._id,
            contentId: record.projectContent._id,
            reviewId: record.review._id
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
        const typeInfo = projectContentService
          .getProjectContentType(record.projectContent.content_type);

        const link = {
          name: 'project.content.details',
          params: {
            projectId: record.project._id,
            contentId: record.projectContent._id
          }
        };

        return {
          ...record,
          actionText: `${typeInfo ? typeInfo.text : 'Publication'} uploaded`,
          meta: {
            title: record.projectContent.title,
            projectContent: record.projectContent,
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
