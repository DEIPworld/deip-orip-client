<template>
  <div>
    <content-upload-dialog @onFinish="newContentUploaded" />

    <v-btn
      :loading="isCreatingDraft"
      :disabled="isCreatingDraft"
      block
      outlined
      color="primary"
      dark
      class="mt-2"
      @click="createDarDraft()"
    >
      Use Editor
    </v-btn>
  </div>
</template>

<script>
  import { ResearchContentService } from '@deip/research-content-service';
  import ContentUploadDialog from '@/components/Contents/ContentUpload/ContentUploadDialog';
  import { mapGetters } from 'vuex';

  const researchContentService = ResearchContentService.getInstance();

  export default {
    name: 'ContentUpload',
    components: { ContentUploadDialog },
    props: {
      researchId: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        isCreatingDraft: false
      };
    },
    computed: {
      ...mapGetters({
        research: 'Research/data'
      })
    },
    methods: {
      createDarDraft() {
        this.isCreatingDraft = true;
        researchContentService
          .createDarContent(this.researchId)
          .then((res) => {
            window.location.replace(
              `${window.location.href}/!draft?ref=${res.draft._id}`
            );
            location.reload();
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            this.isCreatingDraft = false;
          });
      },
      newContentUploaded() {
        Promise.all([
          this.$store.dispatch('ResearchContents/getContents', this.$route.params.researchExternalId),
          this.$store.dispatch('ResearchDrafts/getDrafts', this.$route.params.researchExternalId)
        ])
      }
    }
  };
</script>
