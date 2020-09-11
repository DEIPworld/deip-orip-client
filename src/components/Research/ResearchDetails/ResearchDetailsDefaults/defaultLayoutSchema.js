export const defaultResearchTemplateSchema = [
  {
    component: 'ResearchDetailsHeader',
    props: { research: '@research' }
  },
  {
    component: 'DLayoutSection',
    children: [
      {
        component: 'DLayoutSectionMain',
        children: [
          {
            component: 'DStack',
            props: { gap: 32 },
            children: [
              {
                component: 'DBlock',
                props: {
                  title: 'Description'
                },
                children: [
                  {
                    component: 'div',
                    class: 'text-body-2',
                    text: '{{ research.abstract }}'
                  }
                ]
              },
              {
                component: 'AttributesReadIterator',
                props: { attributes: '@attributesByArea.main' }
              }
            ]
          }
        ]
      },
      {
        component: 'DLayoutSectionSidebar',
        children: [
          {
            component: 'DBlock',
            props: { title: 'Team', small: true, widget: true },
            children: [
              {
                component: 'UsersListWidget',
                props: { users: '@research.members' }
              }
            ]
          },
          {
            component: 'AttributesReadIterator',
            props: { attributes: '@attributesByArea.sidebar', gap: 0 }
          }
        ]
      }
    ]
  }
];

// export const componentBasedSchema = [
//   // Component call as Object
//   {
//     component: 'ResearchHeader',
//     props: { research: '@research' },
//     children: [
//       { component: 'AttributesReadIterator', props: { attributes: '@areaAttribetes.header', view: 's' } }
//     ]
//   },
//   {
//     component: 'LayoutSection',
//     children: [
//       { component: 'AttributesReadIterator', props: { attributes: '@areaAttribetes.main' } },
//       { component: 'ResearchContents', props: { researchExternalId: '@research.external_id' } },
//       { component: 'ResearchReviews', props: { researchExternalId: '@research.external_id' } },
//       // DETAILED ATTRIBUTE VARIANT FOR FUTURE
//       // {
//       //   component: 'AttributesRead',
//       //   props: { attribute: '@research.attributes[**generated-from-layout-gui**]' }
//       // },
//       {
//         component: 'LayoutSectionSidebar',
//         children: [
//           { component: 'AttributesReadIterator', props: { attributes: '@areaAttribetes.sidevar', view: 's' } }
//         ]
//       },
//       // Component call as String
//       'SomeOtherComponent'
//     ]
//   }
// ];

// EXPANDED EXAMPLE

// export const renderBasedSchema = [
//   {
//     is: 'd-layout-header',
//     data: {
//       props: {
//         background: '{{ research.headerBackground }}'
//       }
//     },
//     children: [
//       {
//         is: 'div',
//         data: {
//           class: 'd-flex justify-space-between'
//         },
//         children: [
//           {
//             is: 'v-sheet',
//             data: {
//               props: {
//                 maxWidth: 800,
//                 color: 'transparent'
//               }
//             },
//             children: [
//               {
//                 is: 'd-stack',
//                 data: {
//                   props: {
//                     gap: 16,
//                     color: 'transparent'
//                   }
//                 },
//                 children: [
//                   {
//                     is: 'div',
//                     data: {
//                       class: 'text-h4'
//                     },
//                     children: '{{ research.title }}'
//                   },
//                   {
//                     is: 'd-meta-item',
//                     data: {
//                       props: {
//                         icon: 'today',
//                         label: '{{ research.created_at }}'
//                       }
//                     }
//                   },
//                   {
//                     is: 'd-truncate-more',
//                     children: '{{ research.abstract }}'
//                   },
//                   {
//                     is: 'v-btn',
//                     if: '{{ conditions.isOwner }}',
//                     data: {
//                       props: {
//                         small: true,
//                         outlined: true,
//                         color: 'white',
//                         to: 's'
//                       }
//                     }
//                   }
//                 ]
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// ];
