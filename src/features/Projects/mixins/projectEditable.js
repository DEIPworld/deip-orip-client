export const projectEditable = {
  data() {
    return {
      loading: false
    };
  },

  methods: {
    $$goToProject(project) {
      if (project && (project.external_id || project.externalId)) { // if not proposal
        this.$router.push({
          name: 'project.details',
          params: {
            projectId: project.external_id || project.externalId
          }
        });
      } else {
        this.$router.push({ name: 'explore' });
      }
    }
  }
};
