import AccountView from '@/components/Account/AccountView';
import AccountSummary from '@/components/Account/AccountSummary';
import AccountProfile from '@/components/Account/AccountProfile';
import AccountPassword from '@/components/Account/AccountPassword';
import AccountPrivateKey from '@/components/Account/AccountPrivateKey';
import UserDetails from '@/components/UserDetails/UserDetails';
import UserExpertiseDetails from '@/components/UserDetails/UserExpertiseDetails';
import { store } from '@/store';

export const accountRouting = [{
  path: '/account',
  component: AccountView,
  children: [
    {
      path: '',
      component: AccountSummary,
      children: [
        {
          path: '',
          name: 'account.summary',
          component: UserDetails,
          props: () => ({ username: store.getters['auth/user'].account.name })
        },
        {
          path: 'expertise',
          name: 'account.expertiseDetails',
          component: UserExpertiseDetails,
          props: () => ({ username: store.getters['auth/user'].account.name })
        }
      ]
    },
    {
      path: 'profile',
      name: 'account.profile',
      component: AccountProfile
    },
    {
      path: 'change-password',
      name: 'account.password',
      component: AccountPassword
    }, {
      path: 'private-key',
      name: 'account.privateKey',
      component: AccountPrivateKey
    }
  ]
}];
