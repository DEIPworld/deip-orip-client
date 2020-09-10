<template>
  <d-layout-header v-if="Object.keys(research).length"
    :background="research.headerBackground"
  >
    <div class="d-flex justify-space-between">
      <v-sheet :max-width="800" color="transparent">
        <div class="text-h4 mb-4">
          {{ research.title }}
        </div>

        <d-meta-item :meta="{icon: 'today'}" class="mb-4">
          Created {{ research.created_at }}
        </d-meta-item>

        <d-truncate-more>
          {{ research.abstract }}
        </d-truncate-more>

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
      </v-sheet>

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
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';

  import { mapGetters } from 'vuex';
  import DLayoutHeader from '@/components/Deipify/DLayout/DLayoutHeader';
  import DTruncateMore from '@/components/Deipify/DTruncateMore/DTruncateMore';

  export default {
    name: 'ResearchDetailsHeaderTemp',

    components: {
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

    // computed: {
    //   ...mapGetters({
    //     research: 'research/data'
    //   })
    // }
  };
</script>
