<template>
  <layout-header
    :background="$options.filters.researchBackgroundSrc(research.external_id)"
    :max-width="researchRef.videoSrc ? '100%' : 800"
  >
    <v-row no-gutters>
      <v-col cols="12" md="" style="max-width: 800px">
        <div class="text-h4">
          {{ research.title }}
        </div>
        <div class="pt-2">
          <v-icon small color="white">
            today
          </v-icon>
          Created {{ research.created_at | dateFormat('D MMM YYYY', true) }}
        </div>
        <div v-if="isResearchGroupMember" class="pt-4">
          <v-btn
            class="ma-0 pa-0"
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
        </div>
        <toggle-text class="py-4" :text="research.abstract" />
      </v-col>
      <v-col v-if="researchRef.videoSrc" cols="auto" class="ml-auto">
        <iframe
          class="presentation-video"
          :src="getEmbedVideoUrl(researchRef.videoSrc)"
          frameborder="0"
          allowfullscreen
        />
      </v-col>
    </v-row>
  </layout-header>
</template>

<script>
  import { mapGetters } from 'vuex';
  import LayoutHeader from '@/components/layout/components/LayoutHeader';

  export default {
    name: 'ResearchDetailsHeader',
    components: { LayoutHeader },

    computed: {
      ...mapGetters({
        group: 'rd/group',
        research: 'rd/research',
        researchRef: 'rd/researchRef',
        user: 'auth/user'
      }),

      isResearchGroupMember() {
        return this.research
          ? this.$store.getters['auth/userIsResearchGroupMember'](
            this.research.research_group_id
          )
          : false;
      }
    }
  };
</script>

<style lang="less" scoped>
  .rd-header {
    height: 300px;
    overflow: auto;

    font-style: normal;
    color: white;

    &__title {
      font-family: Muli;
      font-weight: 900;
      font-size: 36px;
      line-height: 40px;
      letter-spacing: 0.25px;
    }

    &__created {
    }

    &__abstract {
      font-family: Roboto;
      font-size: 14px;
      line-height: 16px;
    }
  }

  .feed-header {
    background-size: cover !important;
    background-repeat: no-repeat !important;
    height: 300px;
    width: 100%;
    font-style: normal;
    color: white;
  }
</style>
