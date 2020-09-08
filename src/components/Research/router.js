import Research from '@/components/Research/Research';
import ResearchDetails from '@/components/Research/ResearchDetails/ResearchDetails';
import ResearchExpertise from '@/components/Research/ResearchExpertise/ResearchExpertise';
import ResearchEdit from '@/components/Research/ResearchEdit/ResearchEdit';

export const researchRouting = [{
  path: '/p',
  redirect: { name: 'research.create' },
  component: Research,
  children: [
    {
      name: 'research.create',
      path: 'create',
      component: ResearchEdit
    },

    {
      path: ':researchExternalId',
      component: {
        template: '<router-view />'
      },
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
        }
      ]
    },
  ]
}];
