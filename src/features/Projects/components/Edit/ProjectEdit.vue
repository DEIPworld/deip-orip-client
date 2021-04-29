<template>
  <project-form
    :project="projectExtended"
    :title="$t('researchEdit.title')"
    :loading="loading"
    @submit="updateProject"
  />
</template>

<script>
  // WIP !!!
  import { expandAttributes, parseFormData } from '@/utils/helpers';
  import { projectEditable } from '@/features/Projects/mixins';
  import ProjectForm from '@/features/Projects/components/Form/ProjectForm';
  import { mapGetters } from 'vuex';
  import { ProjectService } from '@deip/project-service';

  const projectService = new ProjectService();

  export default {
    name: 'ProjectEdit',
    components: { ProjectForm },
    mixins: [projectEditable],

    computed: {
      ...mapGetters({
        project: 'Project/projectDetails'
      }),

      projectExtended() {
        return {
          ...this.project,
          ...{
            researchRef: {
              ...this.project.researchRef,
              ...{ attributes: expandAttributes(this.project.researchRef.attributes) }
            }
          }
        };
      }
    },

    methods: {
      updateProject(formData) {
        this.loading = true;

        const onchainData = JSON.parse(formData.get("onchainData"));
        const offchainMeta = JSON.parse(formData.get("offchainMeta"));

        return projectService.updateProject(this.$currentUser, {
          projectId: onchainData.externalId,
          teamId: onchainData.researchGroup,
          isPrivate: !!onchainData.isPrivate,
          members: onchainData.members,
          reviewShare: onchainData.reviewShare,
          compensationShare: onchainData.compensationShare,
          updater: this.$currentUser.username,
          attributes: offchainMeta.attributes,
          formData: formData // files
        }, {
          isProposal: onchainData.researchGroup != this.$currentUser.username
        })
          .then(() => {
            this.$notifier.showSuccess(this.$t('notifier.prUpSuccess'));
            this.$$goToProject(this.project);
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
