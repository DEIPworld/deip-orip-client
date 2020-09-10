export const defaultLayoutSchema = [
  {
    is: 'research-details-header',
    data: {
      props: {
        research: '@research'
      }
    }
  }
];

const schema = [
  { component: 'ResearchHeader' },
  {
    component: 'LayoutSection',
    children: [
      { component: 'ResearchMainAttrs' },
      { component: 'ResearchContents' },
      { component: 'ResearchReviews' },
      {
        component: 'LayoutSectionSidebar',
        children: []
      }
    ]
  }
];

// EXPANDED EXAMPLE

// export const defaultLayoutSchema = [
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
