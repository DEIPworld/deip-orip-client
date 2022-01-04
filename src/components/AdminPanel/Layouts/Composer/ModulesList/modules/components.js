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
          project: '@project'
        }
      },
      {
        name: 'Bookmark Button',
        component: 'ProjectDetailsFollowCta',
        icon: 'mdi-bookmark-multiple-outline',
        props: {
          project: '@project'
        }
      },
      {
        name: 'Contents',
        component: 'ProjectDetailsContents',
        icon: 'mdi-file-document-multiple-outline',
        props: {
          project: '@project'
        }
      },
      {
        name: 'Reviews',
        component: 'ProjectDetailsReviews',
        icon: 'mdi-comment-processing-outline',
        props: {
          project: '@project'
        }
      },
      {
        name: 'Tokenization',
        component: 'ProjectDetailsAssets',
        icon: 'mdi-currency-sign',
        props: {
          project: '@project'
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
          projectId: '@project._id',
          domains: '@project.domains'
        }
      },
      {
        component: 'FundraisingStats',
        name: 'Fund stats',
        icon: 'mdi-cash-refund',
        props: {
          projectId: '@project._id',
          project: '@project' // temp
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
  //     //     projectId: '@project._id',
  //     //     teamId: '@project.teamId'
  //     //   })
  //     // },
  //     {
  //       name: 'Purchased licenses',
  //       component: 'ExpressLicensingPurchased',
  //       icon: 'mdi-certificate-outline',
  //       props: {
  //         licenses: '@project.expressLicenses'
  //       }
  //     },
  //     {
  //       name: 'Licensee list',
  //       component: 'ExpressLicensingLicensee',
  //       icon: 'mdi-certificate',
  //       props: {
  //         licenses: '@project.expressLicenses'
  //       }
  //     }
  //   ]
  // }
];
export const modulesComponents = extendModuleObject(modules, { type: 'staticComponent' });
