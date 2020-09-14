import ContentDetails from '@/components/Contents/ContentDetails/ContentDetails';

const routerView = { template: '<router-view />' };

export const contentRoutingFabric = (parent) => {
  const routeName = (n) => [
    ...(parent ? [parent] : []),
    'content',
    n
  ].join('.');

  return {
    path: 'c',
    component: routerView,

    children: [
      {
        name: routeName('create'),
        path: 'create',
        component: routerView
      },

      {
        path: ':contentExternalId',
        component: routerView,
        children: [
          {
            name: routeName('details'),
            component: ContentDetails,
            path: ''
          },
          {
            name: routeName('edit'),
            path: 'edit',
            component: routerView
          }
        ]
      }
    ]
  };
};
