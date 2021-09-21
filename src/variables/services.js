import { PROPOSAL_TYPES, PROPOSAL_STATUS } from '@deip/proposals-service';
import { EXPERTISE_CONTRIBUTION_TYPE, ECI_STAT_PERIOD_STEP_TYPE, CONTRACT_AGREEMENT_TYPE } from '@deip/constants';
import { projectContentTypes } from '@deip/project-content-service';
import { RESEARCH_CONTENT_TYPES } from '@deip/constants';
import { AWARD_STATUS, AWARD_RECIPIENT_STATUS, AWARD_WITHDRAWAL_REQUEST_STATUS } from '@deip/constants';
import { ASSESSMENT_CRITERIA_TYPE } from '@deip/constants';
import { createEnum } from '@deip/toolbox';

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

const LOC_PROPOSAL_TYPES = createEnum({
  CREATE_RESEARCH: 1,
  UPDATE_RESEARCH: 2,
  CREATE_RESEARCH_MATERIAL: 3,
  CREATE_RESEARCH_TOKEN_SALE: 4,
  UPDATE_RESEARCH_GROUP: 5,
  INVITE_MEMBER: 6,
  EXCLUDE_MEMBER: 7,
  TRANSFER_ASSET: 8,
  EXPRESS_LICENSE_REQUEST: 9,
  ASSET_EXCHANGE_REQUEST: 10,
  RESEARCH_NDA: 11,
  PROJECT_TOKEN_SALE_PROPOSAL: 12,
  CONTRACT_AGREEMENT_PROPOSAL: 13
});

export {
  PROPOSAL_TYPES,
  proposalTypesLabels,
  projectContentTypes,
  EXPERTISE_CONTRIBUTION_TYPE,
  AWARD_STATUS,
  AWARD_RECIPIENT_STATUS,
  AWARD_WITHDRAWAL_REQUEST_STATUS,
  ASSESSMENT_CRITERIA_TYPE,
  ECI_STAT_PERIOD_STEP_TYPE,
  PROPOSAL_STATUS,
  LOC_PROPOSAL_TYPES,
  RESEARCH_CONTENT_TYPES,
  CONTRACT_AGREEMENT_TYPE
};
