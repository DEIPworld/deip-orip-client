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
      if (this.$currentUserName === user.account.name) {
        return { name: 'account.summary' };
      }

      if (user.account.is_research_group) {
        return { name: 'group.detail' };
      }

      return {
        name: 'UserDetails',
        params: { account_name: user.account.name }
      };
    }
  }
};
