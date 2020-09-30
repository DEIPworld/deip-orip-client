import { LAYOUT_TYPES } from '@/variables';

export const baseLayouts = () => ({
  projectDetails: {
    name: 'Project details',
    icon: 'mdi-format-float-left',
    type: LAYOUT_TYPES.READ,
    layout: []
  },
  projectEditForm: {
    name: 'Project create/edit form',
    icon: 'mdi-form-textbox',
    type: LAYOUT_TYPES.SET,
    layout: []
  },
  projectListCard: {
    name: 'Project list card',
    icon: 'mdi-card-text-outline',
    type: LAYOUT_TYPES.READ,
    layout: []
  },
  projectListRow: {
    name: 'Project list row',
    icon: 'mdi-card-text-outline',
    type: LAYOUT_TYPES.READ,
    layout: []
  }
});
