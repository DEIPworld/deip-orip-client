import AdminPanel from '@/components/AdminPanel/AdminPanel';
import { store } from '@/store';
import { loadPage } from '@/router/utils/loadPage';
import AdminMembers from '@/components/AdminPanel/AdminMembers';
import UserRegistration from '@/components/auth/UserRegistration';
import AdminProjects from '@/components/AdminPanel/AdminProjects';
import AdminCriteria from '@/components/AdminPanel/AdminCriteria';
import AdminCriteriaEdit from '@/components/AdminPanel/AdminCriteriaEdit';
import AdminFAQ from '@/components/AdminPanel/AdminFAQ';
import AdminFAQEdit from '@/components/AdminPanel/AdminFAQEdit';
import AdminSettings from '@/components/AdminPanel/AdminSettings';
import AdminLogin from '@/components/AdminPanel/AdminLogin';

export const adminRouting = [
  {
    path: '/admin',
    name: 'admin',
    component: AdminPanel,
    redirect: { name: 'admin.members' },
    children: [
      {
        path: 'members',
        name: 'admin.members',
        component: AdminMembers,
        children: [
          {
            path: 'add',
            name: 'admin.members.add',
            components: {
              dialog: UserRegistration
            },
            props: {
              dialog: {
                title: 'Add new member'
              }
            }
          }
        ]
      },
      {
        path: 'projects',
        name: 'admin.projects',
        component: AdminProjects
      },
      {
        path: 'criteria',
        name: 'admin.criteria',
        component: AdminCriteria,
        children: [
          {
            path: 'add',
            name: 'admin.criteria.add',
            components: {
              dialog: AdminCriteriaEdit
            },
            props: {
              dialog: {
                title: 'Add new criteria'
              }
            }
          }
        ]
      },
      {
        path: 'faq',
        name: 'admin.faq',
        component: AdminFAQ,
        children: [
          {
            path: 'add',
            name: 'admin.faq.add',
            components: {
              dialog: AdminFAQEdit
            },
            props: {
              dialog: {
                title: 'Add new question'
              }
            }
          }
        ]
      },
      {
        path: 'settings',
        name: 'admin.settings',
        component: AdminSettings
      }
    ]
  },
  {
    path: '/admin/login',
    name: 'admin.login',
    component: AdminLogin
  }
];
