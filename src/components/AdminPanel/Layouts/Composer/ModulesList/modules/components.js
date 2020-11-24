import {
  extendModuleObject
} from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/_utils';

export const modules = [
  {
    title: 'Project',
    list: [
      {
        name: 'Edit Button',
        component: 'ProjectDetailsEditCta',
        icon: 'mdi-circle-edit-outline',
        props: {
          project: '@research'
        }
      },
      {
        name: 'Bookmark Button',
        component: 'ProjectDetailsFollowCta',
        icon: 'mdi-bookmark-multiple-outline',
        props: {
          project: '@research'
        }
      },
      {
        name: 'Contents',
        component: 'ProjectDetailsContents',
        icon: 'mdi-file-document-multiple-outline',
        props: {
          project: '@research'
        }
      },
      {
        name: 'Reviews',
        component: 'ProjectDetailsReviews',
        icon: 'mdi-comment-processing-outline',
        props: {
          project: '@research'
        }
      }
    ]
  },

  {
    title: 'Statistic',
    list: [
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
  // {
  //   title: 'Licensing',
  //   list: [
  //     // {
  //     //   name: 'Purchase license',
  //     //   component: 'ExpressLicensingPurchase',
  //     //   icon: 'mdi-cash',
  //     //   ...setComponentProps({
  //     //     attribute: setAs(String)
  //     //   }, {
  //     //     projectId: '@research.externalId',
  //     //     groupId: '@research.researchGroup.external_id'
  //     //   })
  //     // },
  //     {
  //       name: 'Purchased licenses',
  //       component: 'ExpressLicensingPurchased',
  //       icon: 'mdi-certificate-outline',
  //       props: {
  //         licenses: '@research.researchRef.expressLicenses'
  //       }
  //     },
  //     {
  //       name: 'Licensee list',
  //       component: 'ExpressLicensingLicensee',
  //       icon: 'mdi-certificate',
  //       props: {
  //         licenses: '@research.researchRef.expressLicenses'
  //       }
  //     }
  //   ]
  // }
];
export const modulesComponents = extendModuleObject(modules, { type: 'staticComponent' });
