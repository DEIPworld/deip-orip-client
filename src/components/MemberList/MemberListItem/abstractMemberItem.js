import MemberListTitle from '@/components/MemberList/MemberListItem/MemberListItemPartials/MemberListTitle';

import DMetaList from '@/components/Deipify/DMeta/DMetaList';

export const abstractMemberItem = {
  components: {
    MemberListTitle,
    DMetaList
  },
  props: {
    member: {
      type: Object,
      default: () => ({})
    }
  }
};
