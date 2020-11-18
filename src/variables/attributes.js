export const ATTR_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',

  SELECT: 'select',
  // MULTI_SELECT: 'multi-select',

  SWITCH: 'switch',
  CHECKBOX: 'checkbox',

  //= ============================

  URL: 'url',
  VIDEO_URL: 'video-url',
  STEPPER: 'stepper',

  USER: 'user',
  // USERS_LIST: 'users-list',

  DISCIPLINE: 'discipline',
  DISCIPLINES_LIST: 'disciplines-list',

  RESEARCH_GROUP: 'research-group',
  RESEARCH_GROUPS_LIST: 'research-groups-list',

  ROADMAP: 'roadmap',
  PARTNERS: 'partners',

  EXPRESS_LICENSING: 'express-licensing',
  IMAGE: 'image',
  FILE: 'file'
};

export const ATTR_LABELS = {
  [ATTR_TYPES.TEXT]: 'Text field',
  [ATTR_TYPES.TEXTAREA]: 'Text area',

  [ATTR_TYPES.SELECT]: 'Select list',
  // [ATTR_TYPES.MULTI_SELECT]: 'Multiple select',

  [ATTR_TYPES.SWITCH]: 'Switch',
  [ATTR_TYPES.CHECKBOX]: 'Checkbox',

  //= ============================

  [ATTR_TYPES.URL]: 'URL`s list',
  [ATTR_TYPES.VIDEO_URL]: 'Video URL',
  [ATTR_TYPES.STEPPER]: 'Level select',

  [ATTR_TYPES.USER]: 'User select',
  // [ATTR_TYPES.USERS_LIST]: 'Multiple users select',

  [ATTR_TYPES.DISCIPLINE]: 'Discipline',
  [ATTR_TYPES.DISCIPLINES_LIST]: 'Disciplines List',

  [ATTR_TYPES.RESEARCH_GROUP]: 'research-group',
  [ATTR_TYPES.RESEARCH_GROUPS_LIST]: 'research-groups-list',

  [ATTR_TYPES.ROADMAP]: 'Roadmap',
  [ATTR_TYPES.PARTNERS]: 'Partners',

  [ATTR_TYPES.EXPRESS_LICENSING]: 'Express licensing',
  [ATTR_TYPES.IMAGE]: 'Image upload',
  [ATTR_TYPES.FILE]: 'File upload'
};

export const ATTR_ICONS = {
  [ATTR_TYPES.TEXT]: 'mdi-form-textbox',
  [ATTR_TYPES.TEXTAREA]: 'mdi-form-textarea',

  [ATTR_TYPES.SELECT]: 'mdi-form-select',
  // [ATTR_TYPES.MULTI_SELECT]: 'mdi-format-list-checkbox',

  [ATTR_TYPES.SWITCH]: 'mdi-toggle-switch-outline',
  [ATTR_TYPES.CHECKBOX]: 'mdi-check-box-outline',

  //= ============================

  [ATTR_TYPES.URL]: 'mdi-link-variant-plus',
  [ATTR_TYPES.VIDEO_URL]: 'mdi-video-outline',
  [ATTR_TYPES.STEPPER]: 'mdi-format-list-numbered',

  [ATTR_TYPES.USER]: 'mdi-account-outline',
  // [ATTR_TYPES.USERS_LIST]: 'mdi-account-multiple-outline',

  [ATTR_TYPES.DISCIPLINE]: 'mdi-flask-empty-outline',
  [ATTR_TYPES.DISCIPLINES_LIST]: 'mdi-flask-empty-plus-outline',

  [ATTR_TYPES.RESEARCH_GROUP]: 'mdi-account-box-outline',
  [ATTR_TYPES.RESEARCH_GROUPS_LIST]: 'mdi-account-box-multiple-outline',

  [ATTR_TYPES.ROADMAP]: 'mdi-timeline-clock-outline',
  [ATTR_TYPES.PARTNERS]: 'mdi-account-tie-outline',

  [ATTR_TYPES.EXPRESS_LICENSING]: 'mdi-file-certificate-outline',
  [ATTR_TYPES.IMAGE]: 'mdi-file-image-outline',
  [ATTR_TYPES.FILE]: 'mdi-file-outline'
};
