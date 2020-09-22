const vCol = {
  component: 'VCol',
  name: 'Grid column',
  icon: 'mdi-view-grid-plus-outline',
  children: []
};

const div = {
  component: 'VCol',
  children: []
};


export const baseLayoutModules = [
  // { component: 'DLayoutHeader', name: 'Header' },
  {
    component: 'DLayoutSection',
    name: 'Section',
    icon: 'mdi-view-day-outline',
    children: [
      {
        component: 'DLayoutSectionMain',
        name: 'Section main content',
        icon: 'mdi-view-array-outline',
        children: []
      },
    ]
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
    icon: 'mdi-view-column-outline',
    children: [div, div]
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
  ...new Array(6).fill('').map((val, index) => ({
    component: 'div',
    name: `Headline ${index + 1}`,
    icon: `mdi-format-header-${index + 1}`,
    // icon: `
    // <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    //   <g fill="000" fill-opacity=".9" fill-rule="evenodd" font-family="BebasNeueBold, Bebas Neue" font-size="24" font-weight="bold" line-spacing="20">
    //     <text><tspan x="0" y="23">H${index + 1}</tspan></text>
    //   </g>
    // </svg>
    // `,
    children: []
  }))
];
