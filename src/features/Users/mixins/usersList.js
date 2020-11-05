export const usersList = {
  props: {
    users: {
      type: [Array, String],
      default: () => ([])
    }
  },
  methods: {
    userDetailsRoute(name) {
      return this.$currentUserName === name
        ? { name: 'account.summary' }
        : {
          name: 'UserDetails',
          params: { account_name: name }
        };
    }
  }
}
