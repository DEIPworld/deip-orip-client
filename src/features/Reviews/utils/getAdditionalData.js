import deipRpc from '@deip/rpc-client';
import { camelizeObjectKeys } from '@/utils/helpers';
import { ResearchContentService } from '@deip/research-content-service';

const researchContentService = ResearchContentService.getInstance();

export const getAdditionalDataOne = (item) => Promise.all([
  deipRpc.api.getReviewVotesByReviewIdAsync(item.id),
  researchContentService.getResearchContent(item.research_content_external_id)
]).then(([votes, contentData]) => ({
  ...item,
  contentData: camelizeObjectKeys(contentData),
  votes,
  supporters: [...new Set(votes.map((v) => v.voter))]
}));

export const getAdditionalData = (items) => items.map((item) => getAdditionalDataOne(item));
