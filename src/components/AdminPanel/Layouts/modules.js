export const layoutModules = [
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
  },

  { component: 'DBlock', name: 'Titled block' },
  { component: 'DStack', name: 'Elements stack' },
  { component: 'DGrid', name: 'Automatic grid' },
];
