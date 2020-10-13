import { createRange } from 'vuetify/lib/util/helpers';
import {
  extendModuleObject,
  setAs,
  setComponentProps
} from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/_utils';

const modules = [
  {
    list: [
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
    ]
  }
];

export const modulesTypography = extendModuleObject(
  modules,
  {
    type: 'typography'
  }
);
