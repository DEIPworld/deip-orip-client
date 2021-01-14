import AccountView from '@/components/Account/AccountView';
import AccountProfile from '@/components/Account/AccountProfile';
import AccountPassword from '@/components/Account/AccountPassword';
import AccountPrivateKey from '@/components/Account/AccountPrivateKey';
import UserDetails from '@/components/UserDetails/UserDetails';
import UserExpertiseDetails from '@/components/UserDetails/UserExpertiseDetails';
import UserEditEducationDialog from '@/components/UserDetails/components/UserEditEducationDialog';
import UserEditEmploymentDialog from '@/components/UserDetails/components/UserEditEmploymentDialog';
import { store } from '@/store';
import AccountProjectRequests from '@/components/Account/AccountProjectRequests';
import AccountTeamsProjects from '@/components/Account/AccountTeamsProjects';
import AccountPersonalProjects from '@/components/Account/AccountPersonalProjects';
import AccountFollowingProjects from '@/components/Account/AccountFollowingProjects';
import AccountGroups from '@/components/Account/AccountGroups';

export const accountRouting = [{
  path: '/account',
  component: AccountView,
  children: [
    {
      path: '',
      component: {
        template: '<router-view />'
      },
      children: [
        {
          path: '',
          name: 'account.summary',
          component: UserDetails,
          props: () => ({ username: store.getters['Auth/currentUser'].username })
        },
        {
          path: 'expertise',
          name: 'account.expertiseDetails',
          component: UserExpertiseDetails,
          props: () => ({ username: store.getters['Auth/currentUser'].username })
        },
        {
          path: 'edit-education',
          name: 'account.education',
          component: UserEditEducationDialog,
          props: () => ({ username: store.getters['Auth/currentUser'].username }),
          meta: {
            hideSidebar: true
          }
        },
        {
          path: 'edit-employment',
          name: 'account.employment',
          component: UserEditEmploymentDialog,
          props: () => ({ username: store.getters['Auth/currentUser'].username }),
          meta: {
            hideSidebar: true
          }
        }
      ]
    },
    {
      path: 'profile',
      name: 'account.profile',
      component: AccountProfile,
      meta: {
        withoutHeader: true,
        hideSidebar: true
      }
    },
    {
      path: 'projects',
      name: 'account.teams.projects',
      component: AccountTeamsProjects
    },
    {
      path: 'personal-projects',
      name: 'account.personal.projects',
      component: AccountPersonalProjects
    },
    {
      path: 'following-projects',
      name: 'account.following.projects',
      component: AccountFollowingProjects
    },
    {
      path: 'groups',
      name: 'account.groups',
      component: AccountGroups
    },
    {
      path: 'project-requests',
      name: 'account.projectRequests',
      component: AccountProjectRequests
    },
    {
      path: 'change-password',
      name: 'account.password',
      component: AccountPassword
    },
    {
      path: 'private-key',
      name: 'account.privateKey',
      component: AccountPrivateKey
    }
  ]
}];
