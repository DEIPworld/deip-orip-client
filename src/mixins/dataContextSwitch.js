export const dataContextSwitch = {
  props: {
    projectId: {
      type: [String, Number],
      default: null
    },

    contentId: {
      type: [String, Number],
      default: null
    },

    teamId: {
      type: [String, Number],
      default: null
    },

    userId: {
      type: [String, Number],
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

        userName: this.userName // deprecated
      };
    }
  }
}
