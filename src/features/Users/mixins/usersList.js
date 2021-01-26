export const usersList = {
  props: {
    users: {
      type: [Array, String],
      default: () => ([])
    },
    avatarSize: {
      type: [Number, String],
      default: 40
    }
  },
  methods: {
    userDetailsRoute(user) {
      if (this.$isUser && this.$currentUser.username === user.account.name) {
        return { name: 'account.summary' };
      }

      if (user.account.is_research_group) {
        // return { name: 'group.detail' };
        return {
          name: 'ResearchGroupDetails',
          params: {
            research_group_permlink: user.account.name
          }
        };
      }

      return {
        name: 'UserDetails',
        params: { account_name: user.account.name }
      };
    }
  }
};
