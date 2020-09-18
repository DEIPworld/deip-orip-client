export const researchListCardSchema = [
  {
    component: 'VCardText',
    class: 'py-4 text--primary flex-shrink-1 flex-grow-1',
    children: [
      {
        component: 'DStack',
        props: {
          gap: 16
        },
        children: [
          {
            component: 'AttributesReadIterator',
            props: {
              attributes: '@research.researchRef.attributes',
              gap: 16,
              viewType: 'card',
              area: 'researchCard'
            }
          }
        ]
      }
    ]
  },
  { component: 'VDivider' },
  {
    component: 'VCardText',
    class: 'py-4 text--primary',
    children: [
      { component: 'ResearchListItemDate', props: { date: '@research.last_update_time' } }
    ]
  }
];
