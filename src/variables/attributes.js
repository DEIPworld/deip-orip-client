import { ATTR_TYPES as attrTypes, ATTR_SCOPES } from '@deip/constants';

const ATTR_TYPES = [
  ...attrTypes,
  'stepper',
  'domain',
  'teamSelect',
  'expressLicensing',
  'networkContentAccess',
  'roadmap',
  'partners',
  'education',
  'employment',
  'userSelect'
];

const SYSTEM_ATTRS = {
  [ATTR_TYPES.USER || 'userSelect']: true,
  [ATTR_TYPES.DOMAIN || 'domain']: true,
  [ATTR_TYPES.DOMAINS_LIST || 'domainList']: true,
  [ATTR_TYPES.TEAM || 'team']: true,
  [ATTR_TYPES.TEAMS_LIST || 'teamsList']: true,
  [ATTR_TYPES.EXPRESS_LICENSING || 'expressLicensing']: true,
  [ATTR_TYPES.NETWORK_CONTENT_ACCESS || 'networkContentAccess']: true
};

const ATTR_LABELS = {
  [ATTR_TYPES.TEXT || 'text']: 'Text field',
  [ATTR_TYPES.TEXTAREA || 'textarea']: 'Text area',

  [ATTR_TYPES.SELECT || 'select']: 'Select list',

  [ATTR_TYPES.SWITCH || 'switch']: 'Switch',
  [ATTR_TYPES.CHECKBOX || 'checkbox']: 'Checkbox',

  //= ============================

  [ATTR_TYPES.URL || 'url']: 'URL`s list',
  [ATTR_TYPES.VIDEO_URL || 'videoUrl']: 'Video URL',
  [ATTR_TYPES.STEPPER || 'stepper']: 'Level select',

  [ATTR_TYPES.USER || 'userSelect']: 'User select',

  [ATTR_TYPES.DOMAIN || 'domain']: 'Domain',
  [ATTR_TYPES.DOMAINS_LIST || 'domainList']: 'Domains List',

  [ATTR_TYPES.TEAM || 'team']: 'Team',
  [ATTR_TYPES.TEAMS_LIST || 'teamsList']: 'teams-list',

  [ATTR_TYPES.ROADMAP || 'roadmap']: 'Roadmap',
  [ATTR_TYPES.PARTNERS || 'partners']: 'Partners',

  [ATTR_TYPES.EXPRESS_LICENSING || 'expressLicensing']: 'Express licensing',
  [ATTR_TYPES.NETWORK_CONTENT_ACCESS || 'networkContentAccess']: 'Interconnection access',

  [ATTR_TYPES.IMAGE || 'image']: 'Image upload',
  [ATTR_TYPES.FILE || 'file']: 'File upload'
};

const ATTR_ICONS = {
  [ATTR_TYPES.TEXT || 'text']: 'mdi-form-textbox',
  [ATTR_TYPES.TEXTAREA || 'textarea']: 'mdi-form-textarea',

  [ATTR_TYPES.SELECT || 'select']: 'mdi-form-select',

  [ATTR_TYPES.SWITCH || 'switch']: 'mdi-toggle-switch-outline',
  [ATTR_TYPES.CHECKBOX || 'checkbox']: 'mdi-check-box-outline',

  //= ============================

  [ATTR_TYPES.URL || 'url']: 'mdi-link-variant-plus',
  [ATTR_TYPES.VIDEO_URL || 'videoUrl']: 'mdi-video-outline',
  [ATTR_TYPES.STEPPER || 'stepper']: 'mdi-format-list-numbered',

  [ATTR_TYPES.USER || 'userSelect']: 'mdi-account-outline',

  [ATTR_TYPES.DOMAIN || 'domain']: 'mdi-flask-empty-outline',
  [ATTR_TYPES.DOMAINS_LIST || 'domainList']: 'mdi-flask-empty-plus-outline',

  [ATTR_TYPES.TEAM || 'team']: 'mdi-account-box-outline',
  [ATTR_TYPES.TEAMS_LIST || 'teamsList']: 'mdi-account-box-multiple-outline',

  [ATTR_TYPES.ROADMAP || 'roadmap']: 'mdi-timeline-clock-outline',
  [ATTR_TYPES.PARTNERS || 'partners']: 'mdi-account-tie-outline',

  [ATTR_TYPES.EXPRESS_LICENSING || 'expressLicensing']: 'mdi-file-certificate-outline',
  [ATTR_TYPES.NETWORK_CONTENT_ACCESS || 'networkContentAccess']: 'mdi-account-key-outline',

  [ATTR_TYPES.IMAGE || 'image']: 'mdi-file-image-outline',
  [ATTR_TYPES.FILE || 'file']: 'mdi-file-outline'
};

export {
  ATTR_TYPES,
  SYSTEM_ATTRS,
  ATTR_SCOPES,
  ATTR_LABELS,
  ATTR_ICONS
}