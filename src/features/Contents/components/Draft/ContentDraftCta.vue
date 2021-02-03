<template>
  <v-btn
    :loading="loading"
    :disabled="loading"
    block
    outlined
    color="primary"
    @click="createDarDraft()"
  >
    Use editor
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
          .createDarResearchContent(this.projectId)
          .then((res) => {

            this.$router.push({
              name: 'project.content.draft',
              params: {
                draftId: res.draft._id.replace('draft-', ''),
                projectId: res.draft.researchExternalId
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
