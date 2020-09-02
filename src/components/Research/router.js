import Research from '@/components/Research/Research';

export const researchRouting = [{
  path: '/p',
  redirect: { name: 'research.create' },
  component: Research,
  children: [
    {
      name: 'research.create',
      path: 'create',
      component: {
        template: '<div>create</div>'
      }
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
          component: {
            template: '<div>details</div>'
          },
        },
        {
          name: 'research.expetise',
          path: 'expetise',
          component: {
            template: '<div>expetise</div>'
          },
        }
      ]
    },
  ]
}];
