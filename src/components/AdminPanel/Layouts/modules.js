const vCol = {
  component: 'VCol',
  name: 'Column',
  icon: 'mdi-view-grid-plus-outline',
  children: []
};

const div = {
  component: 'VCol',
  children: []
};

export const moduleProps = (availableProps, props = {}) => ({
  availableProps,
  props
});

export const baseLayoutModules = [
  // { component: 'DLayoutHeader', name: 'Header' },
  {
    component: 'DLayoutSection',
    name: 'Section',
    ...moduleProps({
      background: 'string',
      backgroundOverlay: 'string'
    }),
    icon: 'mdi-view-day-outline',
    children: [
      {
        component: 'DLayoutSectionMain',
        name: 'Section main content',
        icon: 'mdi-view-array-outline',
        required: true,
        children: []
      }
    ]
  },
  {
    component: 'DLayoutSectionSidebar',
    name: 'Sidebar',
    icon: 'mdi-view-split-vertical',
    children: []
  },
  {
    component: 'DLayoutSectionSplit',
    name: 'Splitter',
    ...moduleProps({
      template: 'string',
      gap: 'number'
    }),
    icon: 'mdi-view-column-outline',
    children: [div, div]
  }
];

export const helperLayoutModules = [
  {
    component: 'DBlock',
    name: 'Block',
    icon: 'mdi-card-text-outline',
    ...moduleProps({
      title: 'string',
      small: 'boolean',
      widget: 'boolean'
    }),
    children: []
  },
  {
    component: 'DStack',
    name: 'Stack',
    ...moduleProps({
      gap: 'number',
      horizontal: 'boolean'
    }),
    icon: 'mdi-view-headline',
    children: []
  },
  {
    component: 'VDivider',
    name: 'Divider',
    icon: 'mdi-minus',
  },
  {
    component: 'DMetaItem',
    name: 'Metadata',
    icon: 'mdi-text-short',
    ...moduleProps({
      icon: 'string',
      label: 'string'
    })
  }
];

export const gridModules = [
  {
    component: 'DGrid',
    name: 'Auto grid',
    icon: 'mdi-view-module-outline',
    ...moduleProps({
      itemMaxWidth: 'number'
    }),
    children: []
  },
  {
    component: 'VContainer',
    name: 'Container',
    icon: 'mdi-card-outline',
    children: [vCol, vCol, vCol]
  },
  {
    component: 'VRow',
    name: 'Columns',
    icon: 'mdi-view-grid-outline',
    children: [vCol, vCol, vCol]
  },
  vCol
];

export const typographyModules = [
  ...new Array(6).fill('')
    .map((val, index) => ({
      component: 'div',
      name: `Headline ${index + 1}`,
      icon: `mdi-format-header-${index + 1}`,
      class: `text-h${index + 1}`,
      children: []
    })),

  {
    component: 'p',
    name: 'Paragraph',
    icon: 'mdi-text-subject',
    class: 'text-body-2',
    children: []
  },
  {
    component: 'p',
    name: 'Caption',
    icon: 'mdi-text-short',
    class: 'text-caption',
    children: []
  },
];
