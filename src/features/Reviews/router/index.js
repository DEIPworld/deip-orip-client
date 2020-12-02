import Review from '@/features/Reviews/components/Review/Review';
import ReviewCreate from '@/features/Reviews/components/Add/ReviewCreate';
import ReviewDetails from '@/features/Reviews/components/Review/Details/ReviewDetails';

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
        component: Review,
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
