import RecursiveIterator from 'recursive-iterator';
import kindOf from 'kind-of';
import { genObjectId } from '@/utils/helpers';

// partials

const vCol = () => ({
  component: 'VCol',
  name: 'Column',
  icon: 'mdi-view-grid-plus-outline',
  children: []
});

const div = () => ({
  component: 'VCol',
  children: []
});

// helpers

export const setComponentProps = (availableProps, props = {}) => ({
  availableProps,
  props
});

export const extendModuleObject = (obj, ext = { type: 'common' }) => {
  for (const { node } of new RecursiveIterator(obj)) {
    if (kindOf(node) === 'object' && node.component) {
      node.moduleId = genObjectId(node);

      for (const key of Object.keys(ext)) {
        node[key] = ext[key];
      }
    }
  }

  return obj;
};


// modules

export const modulesLayout = [
  // { component: 'DLayoutHeader', name: 'Header' },
  {
    component: 'DLayoutSection',
    name: 'Section',
    ...setComponentProps({
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
    ...setComponentProps({
      template: 'string',
      gap: 'number'
    }),
    icon: 'mdi-view-column-outline',
    children: [div(), div()]
  }
];

export const modulesHelpers = [
  {
    component: 'DBlock',
    name: 'Block',
    icon: 'mdi-card-text-outline',
    ...setComponentProps({
      title: 'string',
      small: 'boolean',
      widget: 'boolean'
    }),
    children: []
  },
  {
    component: 'DStack',
    name: 'Stack',
    ...setComponentProps({
      gap: 'number',
      horizontal: 'boolean'
    }),
    icon: 'mdi-view-headline',
    children: []
  },
  {
    component: 'VDivider',
    name: 'Divider',
    icon: 'mdi-minus'
  },
  {
    component: 'DMetaItem',
    name: 'Metadata',
    icon: 'mdi-text-short',
    ...setComponentProps({
      icon: 'string',
      label: 'string'
    })
  }
];

export const modulesGrid = [
  {
    component: 'DGrid',
    name: 'Auto grid',
    icon: 'mdi-view-module-outline',
    ...setComponentProps({
      itemMaxWidth: 'number'
    }),
    children: []
  },
  {
    component: 'VContainer',
    name: 'Container',
    icon: 'mdi-card-outline',
    children: []
  },
  {
    component: 'VRow',
    name: 'Columns',
    icon: 'mdi-view-grid-outline',
    children: [vCol(), vCol(), vCol()]
  },
  vCol()
];

export const modulesTypography = [
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
  }
];
