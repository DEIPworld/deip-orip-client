import { createEnum } from '@deip/toolbox';

import { PROPOSAL_TYPES } from '@deip/proposals-service';
import {
  EXPERTISE_CONTRIBUTION_TYPE,
  ECI_STAT_PERIOD_STEP_TYPE
} from '@deip/expertise-contributions-service';
import { researchContentTypes } from '@deip/research-service';
import {
  AWARD_STATUS,
  AWARD_RECIPIENT_STATUS,
  AWARD_WITHDRAWAL_REQUEST_STATUS
} from '@deip/grants-service';
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

const maxTitleLength = 255;
const maxDescriptionLength = 2048;

const VIEW_TYPES = createEnum({
  GRID: 1,
  LIST: 2
});

const ATTR_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  SWITCH: 'switch',
  CHECKBOX: 'checkbox',
  MULTI_SELECT: 'multi-select',

  VIDEO_URL: 'video-url',
  STEPPER: 'stepper',

  ROADMAP: 'roadmap',
  PARTNERS: 'partners'
};
const ATTR_TYPES_LIST = {
  [ATTR_TYPES.TEXT]: { value: ATTR_TYPES.TEXT, text: 'Text field' },
  [ATTR_TYPES.TEXTAREA]: { value: ATTR_TYPES.TEXTAREA, text: 'Text area' },
  [ATTR_TYPES.SELECT]: { value: ATTR_TYPES.SELECT, text: 'Dropdown select' },
  [ATTR_TYPES.SWITCH]: { value: ATTR_TYPES.SWITCH, text: 'Switch' },
  [ATTR_TYPES.CHECKBOX]: { value: ATTR_TYPES.CHECKBOX, text: 'Checkbox' },
  [ATTR_TYPES.MULTI_SELECT]: { value: ATTR_TYPES.MULTI_SELECT, text: 'Multiple select' },

  [ATTR_TYPES.VIDEO_URL]: { value: ATTR_TYPES.VIDEO_URL, text: 'Video URL' },
  [ATTR_TYPES.STEPPER]: { value: ATTR_TYPES.STEPPER, text: 'Level select' },

  [ATTR_TYPES.ROADMAP]: { value: ATTR_TYPES.ROADMAP, text: 'Roadmap', system: true },
  [ATTR_TYPES.PARTNERS]: { value: ATTR_TYPES.PARTNERS, text: 'Partners', system: true },
};

const ATTR_AREAS = {
  MAIN: 'main',
  SIDEBAR: 'sidebar',
  HEADER: 'header',
  CARD: 'card'
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
  maxTitleLength,
  maxDescriptionLength,
  VIEW_TYPES,

  ATTR_TYPES,
  ATTR_TYPES_LIST,

  ATTR_AREAS,

  ECI_STAT_PERIOD_STEP_TYPE
};
