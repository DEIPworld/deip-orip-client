import { routerView, routeNameGenerator } from '@/utils/helpers';
import AdminLayouts from '@/components/AdminPanel/Layouts/AdminLayouts';
import AdminLayoutsEdit from '@/components/AdminPanel/Layouts/Edit/AdminLayoutsEdit';

export const layoutsRoutingFabric = (parent) => {
  const routeName = routeNameGenerator('layouts', parent).get;

  return {
    path: 'layouts',
    component: routerView,
    children: [
      {
        path: '',
        name: routeName('list'),
        component: AdminLayouts
      },
      {
        path: ':layoutName/edit',
        name: routeName('edit'),
        component: AdminLayoutsEdit
      }
    ],
  };
};
