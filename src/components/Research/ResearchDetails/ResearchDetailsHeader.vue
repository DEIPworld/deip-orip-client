<template>
  <component
    :is="headerComponent"
    v-bind="headerProps"
  >
    <d-layout-section>
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
    </d-layout-section>
  </component>
</template>

<script>
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';

  import { VImg, VSheet } from 'vuetify/lib/components';
  import { mapGetters } from 'vuex';

  export default {
    name: 'ResearchDetailsHeaderTemp',

    components: {
      DLayoutSection,
      DMetaItem,

      VImg,
      VSheet
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

      background() {
        return this.$options.filters.researchBackgroundSrc(this.research.external_id);
      },
      asBanner() {
        return !!this.background;
      },
      headerComponent() {
        return this.asBanner ? 'v-img' : 'v-sheet';
      },
      headerProps() {
        return this.asBanner
          ? {
            src: this.background,
            gradient: 'to top, rgba(0,0,0,.7), rgba(0,0,0,.3)',
            dark: true,
            width: '100%',
            minHeight: '320px',
            aspectRatio: '0',
            class: 'd-flex align-end'
          }
          : {};
      }
    },
    methods: {
      toggle() {
        this.expanded = !this.expanded;
      }
    }
  };
</script>
