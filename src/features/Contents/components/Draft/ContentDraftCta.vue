<template>
  <v-btn
    :loading="loading"
    :disabled="loading"
    block
    outlined
    color="primary"
    @click="createDarDraft()"
  >
    {{ $t('projectDetails.editor') }}
  </v-btn>
</template>

<script>
  import { dataContextSwitch } from '@/mixins/dataContextSwitch';
  import { ProjectContentService } from '@deip/project-content-service';
  import { PROJECT_CONTENT_FORMAT } from '@/variables';

  const projectContentService = ProjectContentService.getInstance();

  export default {
    name: 'ContentDraftCta',

    mixins: [dataContextSwitch],

    data() {
      return {
        loading: false
      };
    },

    methods: {
      createDarDraft() {
        this.loading = true;

        projectContentService
          .createProjectContentDraft({
            projectId: this.projectId, formatType: PROJECT_CONTENT_FORMAT.DAR
          })
          .then(({ _id: draftId }) => {
            setTimeout(() => {
              this.$router.push({
                name: 'project.content.draft',
                params: {
                  draftId,
                  projectId: this.projectId
                }
              });
            }, 5000);
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  };
</script>
