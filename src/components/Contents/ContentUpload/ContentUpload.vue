<template>
  <content-upload-dialog @onFinish="newContentUploaded" />
</template>

<script>
  import ContentUploadDialog from '@/components/Contents/ContentUpload/ContentUploadDialog';
  import { mapGetters } from 'vuex';


  export default {
    name: 'ContentUpload',
    components: { ContentUploadDialog },
    props: {
      researchId: {
        type: String,
        default: null
      }
    },
    computed: {
      ...mapGetters({
        research: 'Project/projectDetails'
      })
    },
    methods: {

      newContentUploaded() {
        this.$emit('content-uploaded');

        Promise.all([
          // this.$store.dispatch('ProjectContents/getContents', this.$route.params.projectId),
          this.$store.dispatch('ResearchDrafts/getDrafts', this.$route.params.projectId)
        ]);
      }
    }
  };
</script>
