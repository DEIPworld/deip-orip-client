import {
  extendModuleObject,
  setAs,
  setComponentProps
} from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/_utils';

const modules = [
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

export const modulesUi = extendModuleObject(modules);
