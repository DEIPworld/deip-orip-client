import ProjectDetails from '@/features/Projects/components/Project/Details/ProjectDetails';
import ProjectExpertise from '@/features/Projects/components/Project/Expertise/ProjectExpertise';
import ProjectCreate from '@/features/Projects/components/Create/ProjectCreate';
import CreateTokenSale from '@/components/token-sale-create/CreateTokenSale';
import { contentRoutingFabric } from '@/features/Contents/router';
import Project from '@/features/Projects/components/Project/Project';
import ProjectFundraising from '@/features/Projects/components/Project/Fundraising/ProjectFundraising';
import ProjectEdit from '@/features/Projects/components/Project/Edit/ProjectEdit';
import { assetsRoutingFabric } from '@/features/Assets/router';

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
      path: ':researchExternalId',
      component: Project,
      props(route) {
        return {
          projectId: route.params.researchExternalId
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
        {
          name: 'project.createTokenSale',
          path: 'create-fundraise',
          component: CreateTokenSale
        }
      ]
    }
  ]
}];
