import { extendModuleObject } from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/_utils';

export const modules = [
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
  },
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
      researchId: '@research.id',
      groupPemlink: '@research.researchGroup.permlink',
      researchPemlink: '@research.permlink'
    }
  },

  {
    name: 'Edit Button',
    component: 'ResearchDetailsEditCta',
    icon: 'mdi-circle-edit-outline',
    props: {
      project: '@research',
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
];
export const modulesComponents = extendModuleObject(modules, { type: 'staticComponent' });
