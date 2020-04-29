import { PROPOSAL_TYPES } from '@deip/research-group-service';
import { EXPERTISE_CONTRIBUTION_TYPE } from '@deip/expertise-contributions-service';
import { researchContentTypes } from '@deip/research-service';
import { AWARD_STATUS, AWARD_RECIPIENT_STATUS, AWARD_WITHDRAWAL_REQUEST_STATUS } from '@deip/grants-service';

const proposalTypesLabels = {
  [PROPOSAL_TYPES.START_RESEARCH]: 'Start new research project',
  [PROPOSAL_TYPES.INVITE_MEMBER]: 'Invite new member to research group',
  [PROPOSAL_TYPES.EXCLUDE_MEMBER]: 'Exclude member from research group',
  [PROPOSAL_TYPES.SEND_FUNDS]: 'Transfer research group funds',
  [PROPOSAL_TYPES.START_RESEARCH_TOKEN_SALE]: 'Schedule research fundraising campaign',
  [PROPOSAL_TYPES.REBALANCE_RESEARCH_GROUP_TOKENS]: 'Rebalance research group shares',
  [PROPOSAL_TYPES.CHANGE_QUORUM]: 'Change research group quorum threshold',
  [PROPOSAL_TYPES.CHANGE_RESEARCH_REVIEW_SHARE_PERCENT]: 'Change research review award share',
  [PROPOSAL_TYPES.OFFER_RESEARCH_TOKENS]: 'Offer research shares',
  [PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL]: 'Publish research project results',
  [PROPOSAL_TYPES.CHANGE_RESEARCH_GROUP_META_DATA_TYPE]: 'Change research group meta',
  [PROPOSAL_TYPES.CHANGE_RESEARCH_META_DATA_TYPE]: 'Change research meta'
};

export {
  PROPOSAL_TYPES,
  proposalTypesLabels,
  researchContentTypes,
  EXPERTISE_CONTRIBUTION_TYPE,
  AWARD_STATUS,
  AWARD_RECIPIENT_STATUS,
  AWARD_WITHDRAWAL_REQUEST_STATUS
};
