<template>
  <project-form
    :title="$t('adminRouting.projects.create')"
    :loading="loading"
    @submit="createProject"
  />
</template>

<script>
  import { ResearchService } from '@deip/research-service';

  import { parseFormData } from '@/utils/helpers';
  import ProjectForm from '@/features/Projects/components/Form/ProjectForm';
  import { projectEditable } from '@/features/Projects/mixins';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ProjectCreate',
    components: { ProjectForm },
    mixins: [projectEditable],
    methods: {
      createProject(formData) {
        this.loading = true;

        const { onchainData } = parseFormData(formData);

        return this.$$verifyProject(
          onchainData.researchGroup,
          onchainData.title
        )
          .then((verified) => {
            if (verified) {
              const isProposal = onchainData.researchGroup != null && onchainData.researchGroup != this.$currentUser.account.name;
              return researchService.createResearch(
                {
                  privKey: this.$currentUser.privKey,
                  username: this.$currentUser.account.name
                },
                isProposal,
                formData
              )
                .then((project) => {
                  this.$notifier.showSuccess(`Project "${onchainData.title}" has been created successfully`);
                  this.$$goToProject(project);
                })
                .catch((err) => {
                  console.error(err);
                  this.$notifier.showError('An error occurred while creating project, please try again later');
                })
                .finally(() => {
                  this.loading = false;
                });
            }

            this.$notifier.showError('Project exist');
            return true;
          });
      }
    }
  };
</script>
