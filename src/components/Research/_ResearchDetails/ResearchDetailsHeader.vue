<template>
  <d-layout-header
    :background="this.$options.filters.researchBackgroundSrc(research.external_id)"
  >
    <div class="d-flex justify-space-between">



      <v-sheet :max-width="800" color="transparent">
        <div class="text-h4 mb-4">
          {{ research.title }}
        </div>

        <d-meta-item :meta="{icon: 'today'}" class="mb-4">
          Created {{ research.created_at | dateFormat('D MMM YYYY', true) }}
        </d-meta-item>

        <v-clamp :max-lines="3" :expanded="expanded" :autoresize="true">
          {{ research.abstract }}
          <template #after="{ clamped }">
            <a class="link" @click="toggle()" v-if="clamped">
              Read
              {{ expanded ? 'less' : 'more' }}
            </a>
          </template>
        </v-clamp>



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

  export default {
    name: 'ResearchDetailsHeaderTemp',

    components: {
      DLayoutHeader,
      DMetaItem,
    },

    data() {
      return {
        expanded: false
      };
    },

    computed: {
      ...mapGetters({
        research: 'research/data'
      }),
    },
    methods: {
      toggle() {
        this.expanded = !this.expanded;
      }
    }
  };
</script>
