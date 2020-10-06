import RecursiveIterator from 'recursive-iterator';
import kindOf from 'kind-of';
import { genObjectId } from '@/utils/helpers';
import { createRange } from 'vuetify/lib/util/helpers';

// helpers

export const setComponentProps = (availableProps, props = {}) => ({
  availableProps,
  props
});

export const setComponentAttrs = (availableAttrs, attrs = {}) => ({
  availableAttrs,
  attrs
});

export const extendModuleObject = (obj, ext = { type: 'common' }) => {
  for (const { node } of new RecursiveIterator(obj)) {
    if (kindOf(node) === 'object' && node.component) {
      node.moduleId = genObjectId(node);

      for (const key of Object.keys(ext)) {
        if (!node[key]) {
          node[key] = ext[key];
        }
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

// partials

const vCol = () => ({
  component: 'VCol',
  name: 'Column',
  icon: 'mdi-view-grid-plus-outline',
  ...setComponentProps({
    cols: setAs(Number),
  }),
  children: []
});

const div = () => ({
  component: 'div',
  children: []
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
    component: 'VRow',
    name: 'Grid row',
    icon: 'mdi-view-grid-outline',
    ...setComponentProps({
      noGutters: setAs(Boolean)
    }),
    children: [vCol(), vCol()]
  },
  vCol()
];

export const modulesBasic = [

  {
    component: 'VSheet',
    name: 'Container',
    icon: 'mdi-card-outline',
    ...setComponentProps({
      itemMaxWidth: setAs(Number)
    }, {
      color: 'transparent'
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
    icon: 'mdi-view-sequential-outline',
    children: []
  },
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
  }
];

export const modulesUi = [
  {
    component: 'DMetaItem',
    name: 'Meta data',
    icon: 'mdi-tag-text-outline',
    type: 'typography',
    text: '',
    ...setComponentProps({
      icon: setAs(String),
      title: setAs(String)
    }),
    children: []
  },
  {
    component: 'DSimpleTooltip',
    name: 'Tooltip',
    icon: 'mdi-tooltip-text-outline',
    children: []
  },
  {
    component: 'VIcon',
    name: 'Icon',
    icon: 'mdi-star-box-outline',
    text: '',
    ...setComponentProps({
      size: setAs(Number)
    })
  },
  {
    component: 'VDivider',
    name: 'Divider',
    icon: 'mdi-minus'
  }
];

export const modulesTable = [
  {
    component: 'VSimpleTable',
    name: 'Table',
    icon: 'mdi-table',
    ...setComponentProps({
      dense: setAs(Boolean),
      fixedHeader: setAs(Boolean),
      height: setAs(Number)
    }),
    children: []
  },
  {
    component: 'thead',
    name: 'Table header',
    icon: 'mdi-page-layout-header',
    children: []
  },
  {
    component: 'tbody',
    name: 'Table body',
    icon: 'mdi-page-layout-body',
    children: []
  },
  {
    component: 'tr',
    name: 'Table row',
    icon: 'mdi-table-row',
    children: []
  },
  {
    component: 'td',
    name: 'Table cell',
    icon: 'mdi-border-outside',
    ...setComponentAttrs({
      title: setAs(String),
      width: setAs(String)
    }),
    children: []
  }
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
    component: 'VSheet',
    name: 'Base text',
    icon: 'mdi-text-subject',
    class: 'text-body-2',
    ...setComponentProps({
      maxWidth: setAs(Number)
    }, {
      color: 'transparent'
    }),
    children: []
  },
  {
    component: 'div',
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
    component: 'ContentsList',
    name: 'Materials',
    icon: 'mdi-file-document-outline',
    props: {
      researchId: '@research.externalId'
    }
  },
  {
    component: 'DraftsList',
    name: 'Drafts',
    icon: 'mdi-file-edit-outline',
    props: {
      researchId: '@research.externalId'
    }
  },
  {
    component: 'ContentUpload',
    name: 'Material Upload',
    icon: 'mdi-file-upload-outline',
    props: {
      researchId: '@research.external_id'
    }
  },
  {
    component: 'ReviewsList',
    name: 'Reviews',
    icon: 'mdi-comment-processing-outline',
    props: {
      researchId: '@research.externalId'
    }
  },
  {
    component: 'EciStats',
    name: 'ECI stats',
    icon: 'mdi-chart-areaspline',
    props: {
      researchId: '@research.externalId',
      disciplines: '@research.disciplines'
    }
  },
  {
    component: 'FundraisingStats',
    name: 'Fund stats',
    icon: 'mdi-cash-refund',
    props: {
      researchId: '@research.id',
      groupPemlink: '@research.researchGroup.permlink',
      researchPemlink: '@research.permlink'
    }
  },

  {
    name: 'Edit Button',
    component: 'ResearchDetailsEditCta',
    icon: 'mdi-circle-edit-outline',
    props: {
      project: '@research',
    }
  },

  {
    name: 'Bookmark Button',
    component: 'ResearchDetailsFollowCta',
    icon: 'mdi-bookmark-multiple-outline',
    props: {
      project: '@research'
    }
  }
];
