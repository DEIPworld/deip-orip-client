import UserDetails from '@/features/Users/components/User/Details/UserDetails';
import UserExpertiseDetails from '@/features/Users/components/User/Details/UserExpertiseDetails';
import UsersDataProvider from '@/features/Users/components/DataProvider/UsersDataProvider';

export const userRouting = [{
  component: { template: '<router-view />' },
  path: '/user-details',
  children: [
    {
      path: ':account_name',
      component: UsersDataProvider,
      props(route) {
        return {
          username: route.params.account_name
        };
      },
      children: [
        {
          name: 'UserDetails',
          path: '',
          component: UserDetails
        },
        {
          path: 'expertise',
          name: 'UserExpertiseDetails',
          component: UserExpertiseDetails
        }
      ]
    }
  ]
}];
