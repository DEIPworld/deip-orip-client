import { ATTR_TYPES, ATTR_SCOPES } from '@deip/constants';

const SYSTEM_ATTRS = {
  [ATTR_TYPES.USER]: true,
  [ATTR_TYPES.DISCIPLINE]: true,
  [ATTR_TYPES.DISCIPLINES_LIST]: true,
  [ATTR_TYPES.RESEARCH_GROUP]: true,
  [ATTR_TYPES.RESEARCH_GROUPS_LIST]: true,
  [ATTR_TYPES.EXPRESS_LICENSING]: true,
  [ATTR_TYPES.NETWORK_CONTENT_ACCESS]: true
};


const ATTR_LABELS = {
  [ATTR_TYPES.TEXT]: 'Text field',
  [ATTR_TYPES.TEXTAREA]: 'Text area',

  [ATTR_TYPES.SELECT]: 'Select list',

  [ATTR_TYPES.SWITCH]: 'Switch',
  [ATTR_TYPES.CHECKBOX]: 'Checkbox',

  //= ============================

  [ATTR_TYPES.URL]: 'URL`s list',
  [ATTR_TYPES.VIDEO_URL]: 'Video URL',
  [ATTR_TYPES.STEPPER]: 'Level select',

  [ATTR_TYPES.USER]: 'User select',

  [ATTR_TYPES.DISCIPLINE]: 'Discipline',
  [ATTR_TYPES.DISCIPLINES_LIST]: 'Disciplines List',

  [ATTR_TYPES.RESEARCH_GROUP]: 'Research group',
  [ATTR_TYPES.RESEARCH_GROUPS_LIST]: 'research-groups-list',

  [ATTR_TYPES.ROADMAP]: 'Roadmap',
  [ATTR_TYPES.PARTNERS]: 'Partners',

  [ATTR_TYPES.EXPRESS_LICENSING]: 'Express licensing',
  [ATTR_TYPES.NETWORK_CONTENT_ACCESS]: 'Interconnection access',

  [ATTR_TYPES.IMAGE]: 'Image upload',
  [ATTR_TYPES.FILE]: 'File upload'
};

const ATTR_ICONS = {
  [ATTR_TYPES.TEXT]: 'mdi-form-textbox',
  [ATTR_TYPES.TEXTAREA]: 'mdi-form-textarea',

  [ATTR_TYPES.SELECT]: 'mdi-form-select',

  [ATTR_TYPES.SWITCH]: 'mdi-toggle-switch-outline',
  [ATTR_TYPES.CHECKBOX]: 'mdi-check-box-outline',

  //= ============================

  [ATTR_TYPES.URL]: 'mdi-link-variant-plus',
  [ATTR_TYPES.VIDEO_URL]: 'mdi-video-outline',
  [ATTR_TYPES.STEPPER]: 'mdi-format-list-numbered',

  [ATTR_TYPES.USER]: 'mdi-account-outline',

  [ATTR_TYPES.DISCIPLINE]: 'mdi-flask-empty-outline',
  [ATTR_TYPES.DISCIPLINES_LIST]: 'mdi-flask-empty-plus-outline',

  [ATTR_TYPES.RESEARCH_GROUP]: 'mdi-account-box-outline',
  [ATTR_TYPES.RESEARCH_GROUPS_LIST]: 'mdi-account-box-multiple-outline',

  [ATTR_TYPES.ROADMAP]: 'mdi-timeline-clock-outline',
  [ATTR_TYPES.PARTNERS]: 'mdi-account-tie-outline',

  [ATTR_TYPES.EXPRESS_LICENSING]: 'mdi-file-certificate-outline',
  [ATTR_TYPES.NETWORK_CONTENT_ACCESS]: 'mdi-account-key-outline',

  [ATTR_TYPES.IMAGE]: 'mdi-file-image-outline',
  [ATTR_TYPES.FILE]: 'mdi-file-outline'
};

export {
  ATTR_TYPES,
  SYSTEM_ATTRS,
  ATTR_SCOPES,
  ATTR_LABELS,
  ATTR_ICONS
}