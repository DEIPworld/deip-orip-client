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
          { component: 'ResearchListItemTitle', props: { text: '@research.title' } },
          { component: 'ResearchListItemAbstract', props: { text: '@research.abstract' } },
          {
            component: 'AttributesReadIterator',
            props: { attributes: '@attributesByArea.card', gap: 0, small: true }
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
