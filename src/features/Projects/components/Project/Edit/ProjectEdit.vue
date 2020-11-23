<template>
  <project-form
    :project="projectExtended"
    title="Edit technology"
    :loading="loading"
    @submit="updateProject"
  />
</template>

<script>
  // WIP !!!
  import { expandResearchAttributes, parseFormData } from '@/utils/helpers';
  import { projectEditable } from '@/features/Projects/mixins';
  import ProjectForm from '@/features/Projects/components/Form/ProjectForm';
  import { mapGetters } from 'vuex';
  import { ResearchService } from '@deip/research-service';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ProjectEdit',
    components: { ProjectForm },
    mixins: [projectEditable],

    computed: {
      ...mapGetters({
        project: 'Project/data'
      }),

      projectExtended() {
        return {
          ...this.project,
          ...{
            researchRef: {
              ...this.project.researchRef,
              ...{ attributes: expandResearchAttributes(this.project.researchRef.attributes) }
            }
          }
        };
      }
    },

    methods: {
      updateProject(formData) {
        this.loading = true;
        
        const { onchainData } = parseFormData(formData);
        const isProposal = onchainData.researchGroup != this.$currentUser.account.name;
        return researchService.updateResearch(
          {
            privKey: this.$currentUser.privKey,
            username: this.$currentUser.account.name
          },
          isProposal,
          formData
        )
          .then((project) => {
            this.$notifier.showSuccess('Info has been change successfully!');
            this.$$goToProject(project);
          })
          .catch((err) => {
            this.$notifier.showError('An error occurred during change info');
            console.error(err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }

  };
</script>
