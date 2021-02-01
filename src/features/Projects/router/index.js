import ProjectCreate from '@/features/Projects/components/Create/ProjectCreate';
import ProjectDataProvider from '@/features/Projects/components/DataProvider/ProjectDataProvider';
import ProjectDetails from '@/features/Projects/components/Details/ProjectDetails';
import ProjectEdit from '@/features/Projects/components/Edit/ProjectEdit';
import ProjectExpertise from '@/features/Projects/components/Expertise/ProjectExpertise';
// import CreateTokenSale from '@/components/token-sale-create/CreateTokenSale';
import ProjectFundraising from '@/features/Projects/components/Fundraising/ProjectFundraising';

import { contentRoutingFabric } from '@/features/Contents/router';
import { assetsRoutingFabric } from '@/features/Assets/router';
import { fundraisingRoutingFabric } from '@/features/Fundraising/router';

const routerView = { template: '<router-view />' };

export const projectRouting = [{
  path: '/p',
  redirect: { name: 'project.create' },
  component: routerView,

  children: [
    {
      name: 'project.create',
      path: 'create',
      component: ProjectCreate,
      props: {
        title: 'Submit new technology'
      }
    },

    {
      path: ':projectId',
      component: ProjectDataProvider,
      props(route) {
        return {
          projectId: route.params.projectId
        };
      },

      children: [
        {
          name: 'project.details',
          path: '',
          component: ProjectDetails
        },

        {
          name: 'project.expertise',
          path: 'expertise',
          component: ProjectExpertise
        },

        {
          name: 'project.content',
          ...contentRoutingFabric('project')
        },

        {
          name: 'project.assets',
          ...assetsRoutingFabric('project')
        },

        {
          name: 'project.edit',
          path: 'edit',
          component: ProjectEdit
        },
        {
          name: 'project.fundraising',
          path: 'fundraising',
          component: ProjectFundraising
        },

        // {
        //   name: 'project.createTokenSale',
        //   path: 'create-fundraise',
        //   component: CreateTokenSale
        // },

        {
          name: 'project.fundraising.create',
          ...fundraisingRoutingFabric('project')
        },
      ]
    }
  ]
}];
