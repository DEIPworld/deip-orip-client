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

export const setAs = (type, val) => ({
  type: kindOf(type()),
  value: val || null
});

// modules

export const modulesLayout = [
  {
    component: 'DLayoutSection',
    name: 'Section',
    ...setComponentProps({
      background: setAs(String),
      backgroundOverlay: setAs(String),
      alignContent: setAs(Array, ['top', 'center', 'bottom']),
      height: setAs(Number),
      minHeight: setAs(Number),
      dark: setAs(Boolean)
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
      template: setAs(String),
      gap: setAs(Number)
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
      title: setAs(String),
      small: setAs(Boolean),
      widget: setAs(Boolean)
    }),
    children: []
  },
  {
    component: 'DStack',
    name: 'Stack',
    ...setComponentProps({
      gap: setAs(Number),
      horizontal: setAs(Boolean)
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
      icon: setAs(String),
      label: setAs(String)
    })
  }
];

export const modulesGrid = [
  {
    component: 'DGrid',
    name: 'Auto grid',
    icon: 'mdi-view-module-outline',
    ...setComponentProps({
      itemMaxWidth: setAs(Number)
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
  },
  {
    component: 'span',
    name: 'Bold',
    icon: 'mdi-format-bold',
    class: 'font-weight-medium',
    children: []
  }
];

export const modulesComponents = [
  {
    component: 'ContentList',
    name: 'Contents',
    props: {
      researchId: '@research.external_id',
      drafts: false,
      title: 'Research contents'
    }
  },
  {
    component: 'ContentList',
    name: 'Drafts',
    props: {
      researchId: '@research.external_id',
      drafts: true,
      title: 'Research contents drafts'
    }
  },
  {
    component: 'ReviewsList',
    name: 'Reviews',
    props: {
      researchId: '@research.external_id',
    }
  }
];
