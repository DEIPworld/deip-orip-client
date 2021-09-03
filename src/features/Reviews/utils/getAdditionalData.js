import { camelizeObjectKeys } from '@/utils/helpers';
import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';
import { ProjectContentService } from '@deip/project-content-service';

const projectContentService = ProjectContentService.getInstance();
const researchContentReviewsService = ResearchContentReviewsService.getInstance();

export const getAdditionalDataOne = (item) => Promise.all([
  researchContentReviewsService.getReviewVotes(item.external_id),
  projectContentService.getProjectContent(item.research_content_external_id)
]).then(([votes, contentData]) => ({
  ...item,
  contentData: camelizeObjectKeys(contentData),
  votes,
  supporters: [...new Set(votes.map((v) => v.voter))]
}));

export const getAdditionalData = (items) => items.map((item) => getAdditionalDataOne(item));
