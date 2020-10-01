import ResearchDetails from '@/components/Research/ResearchDetails/ResearchDetails';
import ResearchExpertise from '@/components/Research/ResearchExpertise/ResearchExpertise';
import ResearchEdit from '@/components/Research/ResearchEdit/ResearchEdit';
import ContentDetails from '@/components/Contents/ContentDetails/ContentDetails';
import { reviewRoutingFabric } from '@/components/Reviews/router';
import { contentRoutingFabric } from '@/components/Contents/router';
import Research from '@/components/Research/Research';
import ResearchFoundraising from '@/components/Research/ResearchFoundraising/ResearchFoundraising';
import { routerView } from '@/utils/helpers';

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
          name: 'research.edit',
          path: 'edit',
          component: ResearchEdit
        },
        {
          name: 'research.fundraising',
          path: 'fundraising',
          component: ResearchFoundraising
        }
      ]
    },
  ]
}];
