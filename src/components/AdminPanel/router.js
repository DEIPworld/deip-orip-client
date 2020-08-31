import AdminPanel from '@/components/AdminPanel/AdminPanel';
import { store } from '@/store';
import { loadPage } from '@/router/utils/loadPage';
import AdminMembers from '@/components/AdminPanel/AdminMembers';
import UserRegistration from '@/components/auth/UserRegistration';
import AdminProjects from '@/components/AdminPanel/AdminProjects';
import AdminAttributes from '@/components/AdminPanel/AdminAttributes/AdminAttributes';
import AdminAttributesEdit from '@/components/AdminPanel/AdminAttributes/AdminAttributesEdit';
import AdminFAQ from '@/components/AdminPanel/AdminFAQ';
import AdminFAQEdit from '@/components/AdminPanel/AdminFAQEdit';
import AdminSettings from '@/components/AdminPanel/AdminSettings';
import AdminCategories from '@/components/AdminPanel/AdminCategories';
import AdminCategoryEdit from '@/components/AdminPanel/AdminCategoryEdit';
import SignIn from '@/components/auth/SignIn';
import ResearchRequestFormCreate from '@/components/ResearchRequest/ResearchRequestFormCreate';
import ReviewSetup from '@/components/review-setup/ReviewSetup';

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
                title: 'Add new member',
                modal: true
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
        path: 'attributes',
        name: 'admin.attributes',
        component: AdminAttributes,
        children: [
          {
            path: 'edit',
            name: 'admin.attributes.edit',
            components: {
              dialog: AdminAttributesEdit
            },
            props: {
              dialog: {
                title: 'Add new attribute'
              }
            }
          }
        ]
      },
      {
        path: 'categories',
        name: 'admin.categories',
        component: AdminCategories,
        children: [
          {
            path: 'add',
            name: 'admin.categories.add',
            components: {
              dialog: AdminCategoryEdit
            },
            props: {
              dialog: {
                title: 'Add new category'
              }
            }
          }
        ]
      },
      {
        path: 'review-model',
        name: 'admin.reviewModel',
        component: ReviewSetup
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
    path: '/admin/sign-in',
    name: 'admin.login',
    component: SignIn,
    meta: {
      withoutHeader: true
    },
    props: {
      adminLogin: true
    }
  }
];
