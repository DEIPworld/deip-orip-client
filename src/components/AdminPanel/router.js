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
import AdminAttributesSettings
  from '@/components/AdminPanel/AdminAttributes/AdminAttributesSettings';
import AdminLayouts from '@/components/AdminPanel/Layouts/AdminLayouts';
import AdminLayoutsEdit from '@/components/AdminPanel/Layouts/Edit/AdminLayoutsEdit';

import { i18n } from '@/plugins/i18n';

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
                title: i18n.t('adminRouting.members.addMembertitle'),
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
        component: { template: '<router-view />'},
        children: [
          {
            path: '',
            name: 'admin.attributes',
            component: AdminAttributes
          },
          {
            path: 'edit',
            name: 'admin.attributes.edit',
            component: AdminAttributesEdit,
            props: {
              title: i18n.t('adminRouting.attributes.attributesEdit.title')
            }
          },
          {
            path: 'settings',
            name: 'admin.attributes.settings',
            component: AdminAttributesSettings
          }
        ]
      },
      {
        path: 'layouts',
        component: { template: '<router-view />'},
        children: [
          {
            path: '',
            name: 'admin.layouts',
            component: AdminLayouts
          },
          {
            path: ':layoutName/edit',
            name: 'admin.layouts.edit',
            component: AdminLayoutsEdit
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
                title: i18n.t('adminRouting.categories.categoryEdit.title')
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
                title: i18n.t('adminRouting.faq.faqEdit.title')
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
