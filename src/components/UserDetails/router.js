import UserDetails from '@/components/UserDetails/UserDetails';
import UserExpertiseDetails from '@/components/UserDetails/UserExpertiseDetails';

export const userDetailRouting = [{
  component: {
    template: '<router-view></router-view>'
  },
  path: '/user-details',
  children: [
    {
      path: ':account_name',
      name: 'UserDetails',
      component: UserDetails,
      props: (route) => ({ username: route.params.account_name })
    },
    {
      path: ':account_name/expertise',
      name: 'UserExpertiseDetails',
      component: UserExpertiseDetails,
      props: (route) => ({ username: route.params.account_name })
    }
  ]
}];
