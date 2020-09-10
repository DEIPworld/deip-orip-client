<template>
  <research-details-renderer
    v-if="$ready"
    :schema="layoutSchema"
    :research="research"
  />
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { researchStore } from '@/components/Research/ResearchDetails/store';
  import { defaultLayoutSchema } from '@/components/Research/ResearchDetails/ResearchDetailsDefaults/defaultLayoutSchema';
  import { mapGetters } from 'vuex';
  import ResearchDetailsRenderer from '@/components/Research/ResearchDetails/ResearchDetailsRenderer';

  export default {
    name: 'ResearchDetails',
    components: { ResearchDetailsRenderer },
    mixins: [componentStoreFactoryOnce(researchStore)],
    data() {
      return {
        defaultLayoutSchema
      };
    },
    computed: {
      ...mapGetters({
        rawResearch: 'ResearchDetails/data'
      }),

      research() {
        return {
          ...this.rawResearch,
          ...{
            headerBackground: this.$options.filters.researchBackgroundSrc(this.rawResearch.external_id),
            created_at: this.$options.filters.dateFormat(this.rawResearch.created_at, 'D MMM YYYY', true)
          }
        };
      },

      isOwner() {
        return this.research.members.includes(this.$currentUserName);
      },

      layoutSchema() {
        return defaultLayoutSchema;
      }
    },
    created() {
      this.$store
        .dispatch('ResearchDetails/getResearchDetails', this.$route.params.researchExternalId)
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
