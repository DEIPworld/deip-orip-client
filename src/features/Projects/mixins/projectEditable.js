export const projectEditable = {
  data() {
    return {
      loading: false
    };
  },

  methods: {
    $$goToProject(project) {
      if (project && (project._id)) { // if not proposal
        this.$router.push({
          name: 'project.details',
          params: {
            projectId: project._id
          }
        });
      } else {
        this.$router.push({ name: 'explore' });
      }
    }
  }
};
