import ContentDataProvider from '@/features/Contents/components/DataProvider/ContentDataProvider';
import ContentDraft from '@/features/Contents/components/Draft/ContentDraft';
import ContentDetails from '@/features/Contents/components/Details/ContentDetails';

import { routerView, routeNameGenerator } from '@/utils/helpers';
import { reviewRoutingFabric } from '@/features/Reviews/router';
import ContentExpertise from '@/features/Contents/components/Expertise/ContentExpertise';

export const contentRoutingFabric = (parent) => {
  const routeName = routeNameGenerator('content', parent).get;

  return {
    path: 'c',
    component: routerView,

    children: [
      {
        name: routeName('draft'),
        path: 'draft/:draftId',
        component: ContentDraft,
        props(route) {
          return {
            draftId: `draft-${route.params.draftId}`
          };
        },
      },

      {
        path: ':contentId',
        component: ContentDataProvider,
        props(route) {
          return {
            contentId: route.params.contentId
          };
        },
        children: [
          {
            name: routeName('details'),
            component: ContentDetails,
            path: ''
          },
          {
            name: routeName('expertise'),
            component: ContentExpertise,
            path: 'expertise'
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
