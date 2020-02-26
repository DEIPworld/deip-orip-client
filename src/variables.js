import { PROPOSAL_TYPES } from '@deip/proposals-service';
import { EXPERTISE_CONTRIBUTION_TYPE } from '@deip/expertise-contributions-service';
import { researchContentTypes } from '@deip/research-service';
import { AWARD_STATUS, AWARD_RECIPIENT_STATUS, AWARD_WITHDRAWAL_REQUEST_STATUS } from '@deip/grants-service';

const proposalTypesLabels = {
  [PROPOSAL_TYPES.CREATE_RESEARCH]: 'Start new project',
  [PROPOSAL_TYPES.INVITE_MEMBER]: 'Invite new member to team',
  [PROPOSAL_TYPES.EXCLUDE_MEMBER]: 'Exclude member from team',
  [PROPOSAL_TYPES.TRANSFER]: 'Transfer team funds',
  [PROPOSAL_TYPES.CREATE_RESEARCH_TOKEN_SALE]: 'Schedule project fundraising campaign',
  [PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL]: 'Publish project results',
  [PROPOSAL_TYPES.UPDATE_RESEARCH_GROUP]: 'Update team information',
  [PROPOSAL_TYPES.UPDATE_RESEARCH]: 'Update project information'
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
