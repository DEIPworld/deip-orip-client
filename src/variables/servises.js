import { PROPOSAL_TYPES, PROPOSAL_STATUS } from '@deip/proposals-service';
import { EXPERTISE_CONTRIBUTION_TYPE, ECI_STAT_PERIOD_STEP_TYPE } from '@deip/expertise-contributions-service';
import { researchContentTypes } from '@deip/research-service';
import { AWARD_STATUS, AWARD_RECIPIENT_STATUS, AWARD_WITHDRAWAL_REQUEST_STATUS } from '@deip/grants-service';
import { ASSESSMENT_CRITERIA_TYPE } from '@deip/research-content-reviews-service';

const proposalTypesLabels = {
  [PROPOSAL_TYPES.CREATE_RESEARCH]: 'Start new research project',
  [PROPOSAL_TYPES.INVITE_MEMBER]: 'Invite new member to research group',
  [PROPOSAL_TYPES.EXCLUDE_MEMBER]: 'Exclude member from research group',
  [PROPOSAL_TYPES.TRANSFER]: 'Transfer research group funds',
  [PROPOSAL_TYPES.CREATE_RESEARCH_TOKEN_SALE]: 'Schedule research fundraising campaign',
  [PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL]: 'Publish research project results',
  [PROPOSAL_TYPES.UPDATE_RESEARCH_GROUP]: 'Update group meta',
  [PROPOSAL_TYPES.UPDATE_RESEARCH]: 'Update research meta'
};

export {
  PROPOSAL_TYPES,
  proposalTypesLabels,
  researchContentTypes,
  EXPERTISE_CONTRIBUTION_TYPE,
  AWARD_STATUS,
  AWARD_RECIPIENT_STATUS,
  AWARD_WITHDRAWAL_REQUEST_STATUS,
  ASSESSMENT_CRITERIA_TYPE,
  ECI_STAT_PERIOD_STEP_TYPE,
  PROPOSAL_STATUS
};
