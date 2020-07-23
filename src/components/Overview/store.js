import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { EXPERTISE_CONTRIBUTION_TYPE, ECI_STAT_PERIOD_STEP_TYPE } from '@/variables';
import { ResearchService } from '@deip/research-service';
import { getTopLevelNodes } from '@/components/common/disciplines/DisciplineTreeService';

const expertiseContributionsService = ExpertiseContributionsService.getInstance();
const researchService = ResearchService.getInstance();

const criteriaTypes = {
  1: 'Impact',
  2: 'Novelty',
  3: 'Excelence',
  4: 'Rationality',
  5: 'Technical Quality',
  6: 'Replication'
};

const state = {
  criteriaTypes,
  disciplinesExpertiseStats: [],
  disciplinesExpertiseStatsHistory: [],
  eciHistoryByDiscipline: [],
  disciplinesGrowthRate: []
};

const getters = {
  criteriaTypes: () => state.criteriaTypes,
  disciplinesExpertiseStats: () => state.disciplinesExpertiseStats,
  disciplinesExpertiseStatsHistory: () => state.disciplinesExpertiseStatsHistory,
  disciplinesGrowthRate: () => getTopLevelNodes().map(({ id }) => state.disciplinesGrowthRate.find(({ external_id }) => id === external_id)),

  eciHistoryByDiscipline: (state, getters) => { // temp
    const records = state.eciHistoryByDiscipline;

    return [...records].map((record) => {
      if (record.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.REVIEW) {
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
          actionText: `${typeInfo ? typeInfo.text : 'Publication'} reviewed`,
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
          actionText: 'Review supported',
          meta: {
            title,
            review: record.review,
            reviewVote: record.review_vote,
            link
          }
        };
      } else if (record.contribution_type === EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION) {
        const typeInfo = researchService.getResearchContentType(record.research_content.content_type);
        const link = {
          name: 'ResearchContentDetails',
          params: {
            research_group_permlink: decodeURIComponent(record.research_group.permlink),
            research_permlink: decodeURIComponent(record.research.permlink),
            content_permlink: decodeURIComponent(record.research_content.permlink),
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
      } else {
        return {
          ...record,
          actionText: 'Contribution',
          meta: {
            title: 'Contribution'
          }
        };
      }
    });
  }
};

const actions = {
  getDisciplinesExpertiseLastStats(context) {
    return expertiseContributionsService.getDisciplinesExpertiseLastStats()
      .then((res) => {
        context.commit('getDisciplinesExpertiseLastStats', res);
      });
  },

  getDisciplinesExpertiseStatsHistory(context) {
    return expertiseContributionsService.getDisciplinesExpertiseStatsHistory({})
      .then((res) => {
        context.commit('getDisciplinesExpertiseStatsHistory', res);
      });
  },

  getDisciplinesGrowthRate(context, payload = {}) {
    return expertiseContributionsService.getDisciplinesExpertiseStatsHistory(payload)
      .then((res) => {
        context.commit('getDisciplinesGrowthRate', res);
      });
  },

  getEciHistoryByDiscipline(context, payload) {
    return expertiseContributionsService.getDisciplineExpertiseHistory(payload)
      .then((res) => {
        context.commit('getEciHistoryByDiscipline', res);
      });
  },

};

const mutations = {
  getDisciplinesExpertiseLastStats(state, payload) {
    state.disciplinesExpertiseStats = payload.map((a) => a[1]);
  },
  getDisciplinesExpertiseStatsHistory(state, payload) {
    state.disciplinesExpertiseStatsHistory = payload.map((a) => ({ external_id: a[0], history: a[1] }));
  },
  getEciHistoryByDiscipline(state, payload) {
    state.eciHistoryByDiscipline = payload;
  },
  getDisciplinesGrowthRate(state, payload) {
    state.disciplinesGrowthRate = payload.map((a) => ({ external_id: a[0], history: a[1] }));
  }
};

export const overviewStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
