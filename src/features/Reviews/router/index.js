import ReviewDataProvider from '@/features/Reviews/components/DataProvider/ReviewDataProvider';
import ReviewCreate from '@/features/Reviews/components/Create/ReviewCreate';
import ReviewDetails from '@/features/Reviews/components/Details/ReviewDetails';

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
        component: ReviewCreate,
        props(route) {
          return {
            projectId: route.params.projectExternalId,
            contentId: route.params.contentExternalId
          };
        },
      },

      {
        path: ':reviewExternalId',
        component: ReviewDataProvider,
        props(route) {
          return {
            reviewId: route.params.reviewExternalId
          };
        },
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
