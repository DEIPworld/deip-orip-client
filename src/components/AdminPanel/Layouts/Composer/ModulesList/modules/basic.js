import {
  extendModuleObject,
  setAs, setComponentAttrs,
  setComponentProps
} from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/_utils';

const modules = [
  {
    list: [
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
          title: setAs(String)
        }),
        children: []
      },
      {
        component: 'DBlockWidget',
        name: 'Widget',
        icon: 'mdi-subtitles-outline',
        ...setComponentAttrs({
          title: setAs(String)
        }),
        children: []
      },
      {
        component: 'VSpacer',
        name: 'Spacer',
        icon: 'mdi-keyboard-space'
      },
    ]
  }
];

export const modulesBasic = extendModuleObject(modules);
