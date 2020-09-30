import ReviewDetails from '@/components/Reviews/ReviewDetails/ReviewDetails';

const routerView = { template: '<router-view />' };

export const reviewRoutingFabric = (parent) => {

  const routeName = (n) => {
    return [
      ...(parent ? [parent] : []),
      'review',
      n
    ].join('.');
  };

  return {
    path: 'r',
    component: routerView,

    children: [
      {
        name: routeName('create'),
        path: 'create',
        component: routerView
      },

      {
        path: ':reviewExternalId',
        component: routerView,
        children: [
          {
            name: routeName('details'),
            component: ReviewDetails,
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
