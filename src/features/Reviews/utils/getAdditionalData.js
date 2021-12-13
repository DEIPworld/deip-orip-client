import { ProjectContentService } from '@deip/project-content-service';
import { ReviewService } from '@deip/review-service';
import { camelizeObjectKeys } from '@/utils/helpers';

const reviewService = ReviewService.getInstance();
const projectContentService = ProjectContentService.getInstance();

export const getAdditionalDataOne = (item) => Promise.all([
  reviewService.getReviewUpvotes(item.external_id),
  projectContentService.getProjectContent(item.research_content_external_id)
]).then(([votes, contentData]) => ({
  ...item,
  contentData: camelizeObjectKeys(contentData),
  votes,
  supporters: [...new Set(votes.map((v) => v.upvoter))]
}));

export const getAdditionalData = (items) => items.map((item) => getAdditionalDataOne(item));
