export const limitAccess = {
  name: 'LimitAccess',
  props: {
    limitedAccess: {
      type: Boolean,
      default: false
    },
    accessMessage: {
      type: String,
      default: 'No access'
    }
  },

  computed: {
    limitAccessClasses() {
      return {
        'limit-access': this.limitedAccess
      };
    },
    limitAccessProps() {
      return {
        ...(this.limitedAccess ? { 'data-access-message': this.accessMessage } : {})
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
