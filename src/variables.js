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
  MULTI_SELECT: 'multi-select',

  SWITCH: 'switch',
  CHECKBOX: 'checkbox',

  //=============================

  URL: 'url',
  VIDEO_URL: 'video-url',
  STEPPER: 'stepper',

  USER: 'user',
  USERS_LIST: 'users-list',

  DISCIPLINE: 'discipline',
  DISCIPLINES_LIST: 'disciplines-list',

  RESEARCH_GROUP: 'research-group',
  RESEARCH_GROUPS_LIST: 'research-groups-list',

  ROADMAP: 'roadmap',
  PARTNERS: 'partners'
};

const ATTR_TYPES_LABELS = {
  [ATTR_TYPES.TEXT]: 'Text field',
  [ATTR_TYPES.TEXTAREA]: 'Text area',

  [ATTR_TYPES.SELECT]: 'Dropdown select',
  [ATTR_TYPES.MULTI_SELECT]: 'Multiple select',

  [ATTR_TYPES.SWITCH]: 'Switch',
  [ATTR_TYPES.CHECKBOX]: 'Checkbox',

  //=============================

  [ATTR_TYPES.URL]: 'URL`s list',
  [ATTR_TYPES.VIDEO_URL]: 'Video URL',
  [ATTR_TYPES.STEPPER]: 'Level select',

  [ATTR_TYPES.USER]: 'user',
  [ATTR_TYPES.USERS_LIST]: 'users-list',

  [ATTR_TYPES.DISCIPLINE]: 'Discipline',
  [ATTR_TYPES.DISCIPLINES_LIST]: 'Disciplines List',

  [ATTR_TYPES.RESEARCH_GROUP]: 'research-group',
  [ATTR_TYPES.RESEARCH_GROUPS_LIST]: 'research-groups-list',

  [ATTR_TYPES.ROADMAP]: 'Roadmap',
  [ATTR_TYPES.PARTNERS]: 'Partners',
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
  ATTR_TYPES_LABELS,

  ATTR_AREAS,

  ECI_STAT_PERIOD_STEP_TYPE
};
