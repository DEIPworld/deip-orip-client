<template>
  <d-layout-header
    v-if="Object.keys(research).length"
    :background="research.external_id | researchBackgroundSrc"
  >
    <div class="d-flex justify-space-between">
      <d-stack :max-width="800" color="transparent">
        <div class="text-h4">
          {{ research.title }}
        </div>

        <d-meta-item icon="today">
          Created {{ research.created_at | dateFormat('D MMM YYYY', true) }}
        </d-meta-item>

        <v-btn
          v-if="research.members.includes($currentUserName)"
          class="mt-4"
          small
          outlined
          color="white"
          :to="{
            name: 'ResearchEdit',
            params: {
              research_group_permlink: encodeURIComponent(research.research_group.permlink),
              research_permlink: encodeURIComponent(research.permlink)
            }
          }"
        >
          Edit
        </v-btn>
      </d-stack>

      <iframe
        v-if="research.researchRef.videoSrc"
        class="presentation-video"
        :src="getEmbedVideoUrl(researchRef.videoSrc)"
        allowfullscreen
      />
    </div>
  </d-layout-header>
</template>

<script>
  import DLayoutHeader from '@/components/Deipify/DLayout/DLayoutHeader';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';
  import DTruncateMore from '@/components/Deipify/DTruncateMore/DTruncateMore';

  export default {
    name: 'ResearchDetailsHeaderTemp',

    components: {
      DStack,
      DTruncateMore,
      DLayoutHeader,
      DMetaItem
    },

    props: {
      research: {
        type: Object,
        default: () => ({})
      }
    },
    created() {
      // console.log(this.research.researchRef.extendedAttributes)
      // console.log(this.$tenantSettings)
    }
  };
</script>
