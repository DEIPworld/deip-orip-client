export const baseLayoutModules = [
  // { component: 'DLayoutHeader', name: 'Header' },
  {
    component: 'DLayoutSection',
    name: 'Section',
    icon: 'mdi-view-day-outline',
    children: []
  },
  {
    component: 'DLayoutSectionMain',
    name: 'Section main content',
    icon: 'mdi-view-array-outline',
    children: []
  },
  {
    component: 'DLayoutSectionSidebar',
    name: 'Section sidebar',
    icon: 'mdi-view-split-vertical',
    children: []
  },
  {
    component: 'DLayoutSectionSplit',
    name: 'Section columns',
    icon: 'mdi-view-column',
    children: [
      { component: 'div', children: [] },
      { component: 'div', children: [] }
    ]
  }
];

export const helperLayoutModules = [
  {
    component: 'DBlock',
    name: 'Titled block',
    icon: 'mdi-card-text-outline',
    children: []
  },
  {
    component: 'DStack',
    name: 'Elements stack',
    icon: 'mdi-view-headline',
    children: []
  }
];

export const gridModules = [
  {
    component: 'DGrid',
    name: 'Auto grid',
    icon: 'mdi-view-module-outline',
    children: []
  },
  {
    component: 'VRow',
    name: 'Grid row',
    icon: 'mdi-view-grid-outline',
    children: []
  },
  {
    component: 'VCol',
    name: 'Grid column',
    icon: 'mdi-view-grid-plus-outline',
    children: []
  }
];
