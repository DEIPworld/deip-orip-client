<template>
  <d-stack gap="32">
    <contents-list
      ref="ContentsList"

      :project-id="project.externalId"

      :disable-all-routes="isLicensingAccessLimited"
      v-bind="licensingAccessProps"
    />

    <drafts-list
      v-if="isMember"
      ref="DraftList"
      :research-id="project.externalId"
    />

    <d-stack gap="8">
      <content-upload
        v-if="isMember"
        ref="ContentUpload"
        :research-id="project.externalId"
        @content-uploaded="onContentUploaded"
      />
      <content-draft-cta
        v-if="isMember"
        :project-id="project.externalId"
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
