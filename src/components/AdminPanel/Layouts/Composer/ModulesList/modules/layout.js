import {
  extendModuleObject,
  setAs,
  setComponentProps
} from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/_utils';

const div = () => ({
  component: 'div',
  children: []
});

const modules = [
  {
    list: [
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
    ]
  }
];

export const modulesLayout = extendModuleObject(modules);
