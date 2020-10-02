import { routerView } from '@/utils/helpers';
import Research from '@/components/Research/Research';
import ResearchDetails from '@/components/Research/ResearchDetails/ResearchDetails';
import ResearchEdit from '@/components/Research/ResearchEdit/ResearchEdit';
import ResearchExpertise from '@/components/Research/ResearchExpertise/ResearchExpertise';
import ResearchFoundraising from '@/components/Research/ResearchFoundraising/ResearchFoundraising';
import { contentRoutingFabric } from '@/components/Contents/router';
import { reviewRoutingFabric } from '@/components/Reviews/router';

export const researchRouting = [{
  path: '/p',
  redirect: { name: 'research.create' },
  component: routerView,

  children: [
    {
      name: 'research.create',
      path: 'create',
      component: ResearchEdit,
      props: {
        title: 'Submit new technology'
      }
    },

    {
      path: ':researchExternalId',
      component: Research,

      children: [
        {
          name: 'research.details',
          path: '',
          component: ResearchDetails
        },

        {
          name: 'research.edit',
          path: 'edit',
          component: ResearchEdit,
          props: {
            title: 'Edit technology'
          }
        },

        {
          name: 'research.expertise',
          path: 'expertise',
          component: ResearchExpertise
        },

        {
          name: 'research.content',
          ...contentRoutingFabric('research')
        },

        {
          name: 'research.review',
          ...reviewRoutingFabric('research')
        },

        {
          name: 'research.fundraising',
          path: 'fundraising',
          component: ResearchFoundraising
        }
      ]
    }
  ]
}];
