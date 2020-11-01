import {
  extendModuleObject,
  setAs,
  setComponentProps
} from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/_utils';

const vCol = () => ({
  component: 'VCol',
  name: 'Column',
  icon: 'mdi-view-grid-plus-outline',
  ...setComponentProps({
    cols: setAs(Number),
  }),
  children: []
});

const modules = [
  {
    list: [
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
    ]
  }
];

export const modulesGrid = extendModuleObject(modules);
