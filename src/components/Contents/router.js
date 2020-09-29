import ContentDetails from '@/components/Contents/ContentDetails/ContentDetails';
import { routeView, routeNameGenerator } from '@/utils/helpers';

export const contentRoutingFabric = (parent) => {
  const routeName = (n) => [
    ...(parent ? [parent] : []),
    'content',
    n
  ].join('.');

  return {
    path: 'c',
    component: routeView,

    children: [
      {
        name: routeName('create'),
        path: 'create',
        component: routeView
      },

      {
        path: ':contentExternalId',
        component: routeView,
        children: [
          {
            name: routeName('details'),
            component: ContentDetails,
            path: ''
          },
          {
            name: routeName('edit'),
            path: 'edit',
            component: routeView
          }
        ]
      }
    ]
  };
};
