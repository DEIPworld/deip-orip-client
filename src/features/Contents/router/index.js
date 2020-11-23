import ContentDetails from '@/features/Contents/components/Content/Details/ContentDetails';
import { routerView, routeNameGenerator } from '@/utils/helpers';
import Content from '@/features/Contents/components/Content/Content';
import { reviewRoutingFabric } from '@/features/Reviews/router';

export const contentRoutingFabric = (parent) => {
  const routeName = routeNameGenerator('content', parent).get;

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
        component: Content,
        props(route) {
          return {
            contentId: route.params.contentExternalId
          };
        },
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
          },
          {
            name: routeName('review'),
            ...reviewRoutingFabric(routeName())
          },
        ]
      }
    ]
  };
};
