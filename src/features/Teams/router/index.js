import TeamDetails from '@/features/Teams/components/Details/TeamDetails';
import TeamCreate from '@/features/Teams/components/Create/TeamCreate';
import TeamDataProvider from '@/features/Teams/components/DataProvider/TeamDataProvider';
import TeamEdit from '@/features/Teams/components/Edit/TeamEdit';

export const teamRouting = [{
  component: { template: '<router-view />' },
  path: '/g',
  redirect: { name: 'team.create' },
  children: [
    {
      name: 'team.create',
      path: 'create',
      component: TeamCreate
    },
    {
      path: ':teamId',
      component: TeamDataProvider,
      props(route) {
        return {
          teamId: route.params.teamId
        };
      },
      children: [
        {
          name: 'team.details',
          path: '',
          component: TeamDetails
        },
        {
          name: 'team.edit',
          path: 'edit',
          component: TeamEdit
        }
      ]
    }
  ]
}];
