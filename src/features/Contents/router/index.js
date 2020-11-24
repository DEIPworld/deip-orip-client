import Content from '@/features/Contents/components/Content/Content';
import ContentDraft from '@/features/Contents/components/Content/Draft/ContentDraft';
import ContentDetails from '@/features/Contents/components/Content/Details/ContentDetails';

import { routerView, routeNameGenerator } from '@/utils/helpers';
import { reviewRoutingFabric } from '@/features/Reviews/router';

export const contentRoutingFabric = (parent) => {
  const routeName = routeNameGenerator('content', parent).get;

  return {
    path: 'c',
    component: routerView,

    children: [
      {
        name: routeName('draft'),
        path: 'draft-:draftId',
        component: ContentDraft,
        props(route) {
          return {
            draftId: route.params.draftId
          };
        },
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
            name: routeName('review'),
            ...reviewRoutingFabric(routeName())
          },
        ]
      }
    ]
  };
};
