import {
  extendModuleObject,
  setAs,
  setComponentProps
} from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/_utils';

export const modules = [
  {
    title: 'Project actions',
    list: [
      {
        name: 'Edit Button',
        component: 'ResearchDetailsEditCta',
        icon: 'mdi-circle-edit-outline',
        props: {
          project: '@research'
        }
      },
      {
        name: 'Bookmark Button',
        component: 'ResearchDetailsFollowCta',
        icon: 'mdi-bookmark-multiple-outline',
        props: {
          project: '@research'
        }
      }
    ]
  },
  {
    title: 'Materials',
    list: [
      {
        component: 'ContentsList',
        name: 'Materials',
        icon: 'mdi-file-document-outline',
        props: {
          researchId: '@research.externalId'
        }
      },
      {
        component: 'DraftsList',
        name: 'Drafts',
        icon: 'mdi-file-edit-outline',
        props: {
          researchId: '@research.externalId'
        }
      },
      {
        component: 'ContentUpload',
        name: 'Material Upload',
        icon: 'mdi-file-upload-outline',
        props: {
          researchId: '@research.external_id'
        }
      }
    ]
  },
  {
    title: 'Statistic',
    list: [
      {
        component: 'ReviewsList',
        name: 'Reviews',
        icon: 'mdi-comment-processing-outline',
        props: {
          researchId: '@research.externalId'
        }
      },
      {
        component: 'EciStats',
        name: 'ECI stats',
        icon: 'mdi-chart-areaspline',
        props: {
          researchId: '@research.externalId',
          disciplines: '@research.disciplines'
        }
      },
      {
        component: 'FundraisingStats',
        name: 'Fund stats',
        icon: 'mdi-cash-refund',
        props: {
          researchId: '@research.externalId'
        }
      },
    ]
  },
  {
    title: 'Licensing',
    list: [
      {
        name: 'Purchase license',
        component: 'ExpressLicensingPurchase',
        icon: 'mdi-cash',
        ...setComponentProps({
          attribute: setAs(String)
        }, {
          projectId: '@research.externalId',
          groupId: '@research.researchGroup.external_id'
        })
      },
      {
        name: 'Purchased licenses',
        component: 'ExpressLicensingPurchased',
        icon: 'mdi-certificate-outline',
        props: {
          projectId: '@research.externalId',
          groupId: '@research.externalId'
        }
      },
      {
        name: 'Licensee list',
        component: 'ExpressLicensingLicensee',
        icon: 'mdi-certificate',
        props: {
          projectId: '@research.externalId',
          groupId: '@research.externalId'
        }
      }
    ]
  }
];
export const modulesComponents = extendModuleObject(modules, { type: 'staticComponent' });
