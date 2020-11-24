<template>
  <d-stack gap="32">
    <contents-list
      ref="ContentsList"

      :project-id="project.externalId"

      :disabled="$$limitedAccess"
      v-bind="$$limitedAccessProps"
    />
    <drafts-list
      v-if="isMember"
      ref="DraftList"
      :research-id="project.externalId"
    />
    <content-upload
      v-if="isMember"
      ref="ContentUpload"
      :research-id="project.externalId"
      @content-upload="onContentUploaded"
    />
    <content-draft-cta
      :project-id="project.externalId"
    />
  </d-stack>
</template>

<script>
  import DStack from '@/components/Deipify/DStack/DStack';
  import ContentsList from '@/features/Contents/components/List/ContentsList';
  import DraftsList from '@/components/DraftsList/DraftsList';
  import ContentUpload from '@/components/Contents/ContentUpload/ContentUpload';
  import { projectDetails } from '@/features/Projects/mixins/projectDetails';
  import { limitAccess } from '@/mixins/limitAccess';
  import ContentDraftCta from '@/features/Contents/components/Content/Draft/ContentDraftCta';

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
      projectDetails,
      limitAccess
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
