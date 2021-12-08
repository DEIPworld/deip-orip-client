<template>
  <project-form
    :title="$t('adminRouting.projects.create')"
    :loading="loading"
    @submit="createProject"
  />
</template>

<script>
  import { ProjectService } from '@deip/project-service';
  import ProjectForm from '@/features/Projects/components/Form/ProjectForm';
  import { projectEditable } from '@/features/Projects/mixins';

  const projectService = ProjectService.getInstance();

  export default {
    name: 'ProjectCreate',
    components: { ProjectForm },
    mixins: [projectEditable],
    methods: {
      createProject(formData) {
        this.loading = true;

        const onchainData = JSON.parse(formData.get("onchainData"));
        const offchainMeta = JSON.parse(formData.get("offchainMeta"));

        return projectService.createProject(this.$currentUser, {
          isAdmin: this.$currentUser.profile.roles.some(r => r.role === 'admin' && r.teamId === this.$env.TENANT),
          teamId: onchainData.researchGroup,
          creator: this.$currentUser.username,
          domains: onchainData.disciplines,
          isPrivate: !!onchainData.isPrivate,
          members: onchainData.members,
          attributes: offchainMeta.attributes,
          formData: formData // files
        }, {
          isProposal: onchainData.researchGroup != this.$currentUser.username
        })
          .then((project) => {
            this.$notifier.showSuccess(this.$t('notifier.prCreatedSuccess', { title: onchainData.title }));
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
    }
  };
</script>
