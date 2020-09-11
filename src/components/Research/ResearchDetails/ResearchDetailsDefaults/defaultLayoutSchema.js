export const defaultLayoutSchema = [
  {
    is: 'research-details-header',
    data: {
      props: {
        research: '@research', // vm props call. return instance
        someProp: '{{ count }} items in list' // vm variable call. return string
      }
    }
  }
];

// BASIC RENDERER SCHEMA

export const componentBasedSchema = [
  // Component call as Object
  {
    component: 'ResearchHeader',
    props: { research: '@research' },
    children: [
      { component: 'AttributesReadIterator', props: { attributes: '@areaAttribetes.header', view: 's' } }
    ]
  },
  {
    component: 'LayoutSection',
    children: [
      { component: 'AttributesReadIterator', props: { attributes: '@areaAttribetes.main' } },
      { component: 'ResearchContents', props: { researchExternalId: '@research.external_id' } },
      { component: 'ResearchReviews', props: { researchExternalId: '@research.external_id' } },
      // DETAILED ATTRIBUTE VARIANT FOR FUTURE
      // {
      //   component: 'AttributesRead',
      //   props: { attribute: '@research.attributes[**generated-from-layout-gui**]' }
      // },
      {
        component: 'LayoutSectionSidebar',
        children: [
          { component: 'AttributesReadIterator', props: { attributes: '@areaAttribetes.sidevar', view: 's' } }
        ]
      },
      // Component call as String
      'SomeOtherComponent'
    ]
  }
];

// EXPANDED EXAMPLE

export const renderBasedSchema = [
  {
    is: 'd-layout-header',
    data: {
      props: {
        background: '{{ research.headerBackground }}'
      }
    },
    children: [
      {
        is: 'div',
        data: {
          class: 'd-flex justify-space-between'
        },
        children: [
          {
            is: 'v-sheet',
            data: {
              props: {
                maxWidth: 800,
                color: 'transparent'
              }
            },
            children: [
              {
                is: 'd-stack',
                data: {
                  props: {
                    gap: 16,
                    color: 'transparent'
                  }
                },
                children: [
                  {
                    is: 'div',
                    data: {
                      class: 'text-h4'
                    },
                    children: '{{ research.title }}'
                  },
                  {
                    is: 'd-meta-item',
                    data: {
                      props: {
                        icon: 'today',
                        label: '{{ research.created_at }}'
                      }
                    }
                  },
                  {
                    is: 'd-truncate-more',
                    children: '{{ research.abstract }}'
                  },
                  {
                    is: 'v-btn',
                    if: '{{ conditions.isOwner }}',
                    data: {
                      props: {
                        small: true,
                        outlined: true,
                        color: 'white',
                        to: 's'
                      }
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
