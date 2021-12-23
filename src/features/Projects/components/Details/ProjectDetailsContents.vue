<template>
  <d-stack gap="32">
    <contents-list
      ref="ContentsList"

      :project-id="project._id"

      :disable-all-routes="!contentAssessAllowed"
      v-bind="accessContainerProps"
    />

    <drafts-list
      v-if="isMember"
      ref="DraftList"
      :project-id="project._id"
    />

    <d-stack gap="8">
      <content-upload
        v-if="isMember"
        ref="ContentUpload"
        :project-id="project._id"
        @content-uploaded="onContentUploaded"
      />
      <content-draft-cta
        v-if="isMember"
        :project-id="project._id"
      />
    </d-stack>

  </d-stack>
</template>

<script>
  import DStack from '@/components/Deipify/DStack/DStack';
  import ContentsList from '@/features/Contents/components/List/ContentsList';
  import DraftsList from '@/components/DraftsList/DraftsList';
  import ContentUpload from '@/components/Contents/ContentUpload/ContentUpload';
  import { projectDetails } from '@/features/Projects/mixins/projectDetails';
  import ContentDraftCta from '@/features/Contents/components/Draft/ContentDraftCta';

  export default {
    name: 'ProjectDetailsContents',

    components: {
      ContentDraftCta,
      ContentUpload,
      DraftsList,
      ContentsList,
      DStack
    },

    mixins: [
      projectDetails
    ],

    computed: {
    },

    methods: {
      onContentUploaded() {
        this.$refs.ContentsList.updateData();
      }
    }
  };
</script>
