<template>
  <v-btn
    :loading="loading"
    :disabled="loading"
    block
    outlined
    color="primary"
    @click="createDarDraft()"
  >
    {{ $t('researchDetails.editor') }}
  </v-btn>
</template>

<script>
  import { dataContextSwitch } from '@/mixins/dataContextSwitch';
  import { ResearchContentService } from '@deip/research-content-service';

  const researchContentService = ResearchContentService.getInstance();

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

        researchContentService
          .createResearchContentDraftDar(this.projectId)
          .then((draft) => {

            this.$router.push({
              name: 'project.content.draft',
              params: {
                draftId: draft._id.replace('draft-', ''),
                projectId: draft.researchExternalId
              }
            });
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
