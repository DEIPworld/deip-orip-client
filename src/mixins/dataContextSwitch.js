export const dataContextSwitch = {
  props: {
    projectId: {
      type: [String, Number, Array],
      default: null
    },

    contentId: {
      type: [String, Number, Array],
      default: null
    },

    teamId: {
      type: [String, Number, Array],
      default: null
    },

    userId: {
      type: [String, Number, Array],
      default: null
    },

    domainId: {
      type: [String, Number, Array],
      default: null
    },

    userName: { // deprecated
      type: [String, Number],
      default: null
    }
  },

  computed: {
    $$dataContextProps() {
      return {
        projectId: this.projectId,
        contentId: this.contentId,
        teamId: this.teamId,
        userId: this.userId,
        domainId: this.domainId,

        userName: this.userName // deprecated
      };
    }
  }
}
