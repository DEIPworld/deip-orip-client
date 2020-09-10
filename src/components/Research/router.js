import ResearchDetails from '@/components/Research/ResearchDetails/ResearchDetails';
import ResearchExpertise from '@/components/Research/ResearchExpertise/ResearchExpertise';
import ResearchEdit from '@/components/Research/ResearchEdit/ResearchEdit';

const routerView = { template: '<router-view />' };

export const researchRouting = [{
  path: '/p',
  redirect: { name: 'research.create' },
  component: routerView,

  children: [
    {
      name: 'research.create',
      path: 'create',
      component: ResearchEdit
    },

    {
      path: ':researchExternalId',
      component: routerView,

      children: [
        {
          name: 'research.details',
          path: '',
          component: ResearchDetails
        },

        {
          name: 'research.expertise',
          path: 'expertise',
          component: ResearchExpertise
        },

        {
          name: 'research.edit',
          path: 'edit',
          component: ResearchEdit
        }
      ]
    },
  ]
}];
