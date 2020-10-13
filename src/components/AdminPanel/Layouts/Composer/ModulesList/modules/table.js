import {
  extendModuleObject,
  setAs, setComponentAttrs,
  setComponentProps
} from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/_utils';

const modules = [
  {
    list: [
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
    ]
  }
];

export const modulesTable = extendModuleObject(modules);
