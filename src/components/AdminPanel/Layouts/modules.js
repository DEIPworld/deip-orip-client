export const baseLayoutModules = [
  { component: 'DLayoutHeader', name: 'Header' },
  { component: 'DLayoutSection', name: 'Section' },
  { component: 'DLayoutSectionMain', name: 'Section content' },
  { component: 'DLayoutSectionSidebar', name: 'Section sidebar' },
  {
    component: 'DLayoutSectionSplit',
    name: 'Section columns',
    children: [
      { component: 'div' },
      { component: 'div' }
    ]
  }
];

export const helperLayoutModules = [
  { component: 'DBlock', name: 'Titled block' },
  { component: 'DStack', name: 'Elements stack' },
];

export const gridModules = [
  { component: 'DGrid', name: 'Auto grid' },
  { component: 'VRow', name: 'Grid row' },
  { component: 'VCol', name: 'Grid column' },
];
