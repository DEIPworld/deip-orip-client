import Group from '@/components/Group/Group';
import GroupEdit from '@/components/Group/GroupEdit/GroupEdit';

export const groupRouting = [{
  path: '/g',
  redirect: { name: 'group.create' },
  component: Group,
  children: [
    {
      name: 'group.create',
      path: 'create',
      component: GroupEdit
    },

    {
      path: ':groupExternalId',
      component: {
        template: '<router-view />'
      },
      // children: [
      //   {
      //     name: 'group.details',
      //     path: '',
      //     component: ProjectDetails
      //   },
      //   {
      //     name: 'group.expertise',
      //     path: 'expertise',
      //     component: ProjectExpertise
      //   }
      // ]
    },
  ]
}];
