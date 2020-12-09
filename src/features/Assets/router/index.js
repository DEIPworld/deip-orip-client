import { routerView, routeNameGenerator } from '@/utils/helpers';
import AssetCreate from '@/features/Assets/components/Create/AssetCreate';

export const assetsRoutingFabric = (parent) => {
  const routeName = routeNameGenerator('asset', parent).get;

  return {
    path: 'asset',
    component: routerView,
    redirect: {
      name: routeName('create')
    },
    children: [
      {
        name: routeName('create'),
        path: 'create',
        component: AssetCreate,
        props(route) {
          return {
            projectId: route.params.researchExternalId
          };
        }
      }
    ]
  };
};
