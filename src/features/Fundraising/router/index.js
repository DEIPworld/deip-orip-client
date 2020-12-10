import { routerView, routeNameGenerator } from '@/utils/helpers';
import FundraisingCreate from '@/features/Fundraising/components/Create/FundraisingCreate';

export const fundraisingRoutingFabric = (parent) => {
  const routeName = routeNameGenerator('fundraise', parent).get;

  return {
    path: 'fundraising',
    component: routerView,
    redirect: {
      name: routeName('create')
    },
    children: [
      {
        name: routeName('create'),
        path: 'create',
        component: FundraisingCreate,
        props(route) {
          return {
            projectId: route.params.researchExternalId
          };
        }
      }
    ]
  };
};
