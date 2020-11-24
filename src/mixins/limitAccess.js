export const limitAccess = {
  name: 'LimitAccess',

  data() {
    return {
      limitAccessMessage: 'Become available after licensing'
    };
  },

  computed: {
    $$limitedAccess() {
      return false;
    },

    $$limitedAccessProps() {
      return {
        ...(this.limitedAccess ? {
          'data-access-message': this.limitAccessMessage,
          class: 'limit-access'
        } : {})
      };
    }
  },

  methods: {
    routeAccessCheck(caller) {
      if (this.limitedAccess) {
        return {};
      }

      return caller;
    }
  }
};
