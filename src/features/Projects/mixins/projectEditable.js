import { ResearchService } from '@deip/research-service';

const researchService = ResearchService.getInstance();

export const projectEditable = {
  data() {
    return {
      loading: false
    };
  },

  methods: {
    $$verifyProject(groupId, title, projectId) {
      if (groupId && !projectId) {
        return researchService
          .checkResearchExistenceByPermlink(groupId, title)
          .then((exists) => !exists);
      }

      return Promise.resolve(true)
        .then((verified) => verified);
    },

    $$goToProject(project) {
      if (project && (project.external_id || project.externalId)) { // if not proposal
        this.$router.push({
          name: 'project.details',
          params: {
            researchExternalId: project.external_id || project.externalId
          }
        });
      } else {
        this.$router.push({ name: 'explore' });
      }
    }
  }
};
