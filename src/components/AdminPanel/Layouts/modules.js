import RecursiveIterator from 'recursive-iterator';
import kindOf from 'kind-of';
import { genObjectId } from '@/utils/helpers';
import { createRange } from 'vuetify/lib/util/helpers';

// partials

const vCol = () => ({
  component: 'VCol',
  name: 'Column',
  icon: 'mdi-view-grid-plus-outline',
  children: []
});

const div = () => ({
  component: 'div',
  children: []
});

// helpers

export const setComponentProps = (availableProps, props = {}) => ({
  ...{ availableProps },
  ...{ props }
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

// typing

const str = typeof String();
const num = typeof Number();
const arr = typeof Array();
const bool = typeof Boolean();

// modules

export const modulesLayout = [
  {
    component: 'DLayoutSection',
    name: 'Section',
    ...setComponentProps({
      background: str,
      backgroundOverlay: str,
      alignContent: str,
      height: num,
      minHeight: num,
      dark: bool
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
      template: str,
      gap: num
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
      title: str,
      small: bool,
      widget: bool
    }),
    children: []
  },
  {
    component: 'DStack',
    name: 'Stack',
    ...setComponentProps({
      gap: num,
      horizontal: bool
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
      icon: str,
      label: str
    })
  }
];

export const modulesGrid = [
  {
    component: 'DGrid',
    name: 'Auto grid',
    icon: 'mdi-view-module-outline',
    ...setComponentProps({
      itemMaxWidth: num
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
  ...createRange(6)
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
    icon: 'mdi-format-paragraph',
    class: 'text-body-2',
    children: []
  },
  {
    component: 'p',
    name: 'Caption',
    icon: 'mdi-closed-caption-outline',
    class: 'text-caption',
    children: []
  }
];
