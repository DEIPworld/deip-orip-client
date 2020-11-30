import deipRpc from '@deip/rpc-client';
import { camelizeObjectKeys } from '@/utils/helpers';

export const getAdditionalDataOne = (item) => Promise.all([
  deipRpc.api.getReviewVotesByReviewIdAsync(item.id),
  deipRpc.api.getResearchContentAsync(item.research_content_external_id)
]).then(([votes, contentData]) => ({
  ...item,
  contentData: camelizeObjectKeys(contentData),
  votes,
  supporters: [...new Set(votes.map((v) => v.voter))]
}));

export const getAdditionalData = (items) => items.map((item) => getAdditionalDataOne(item));
