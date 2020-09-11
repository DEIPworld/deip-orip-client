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
  import { defaultResearchTemplateSchema } from '@/components/Research/ResearchDetails/ResearchDetailsDefaults/defaultLayoutSchema';
  import { mapGetters } from 'vuex';
  import ResearchDetailsRenderer from '@/components/Research/ResearchDetails/ResearchDetailsRenderer';

  export default {
    name: 'ResearchDetails',
    components: { ResearchDetailsRenderer },
    mixins: [componentStoreFactoryOnce(researchStore)],
    data() {
      return {
        defaultResearchTemplateSchema
      };
    },
    computed: {
      ...mapGetters({
        research: 'ResearchDetails/data'
      }),

      isOwner() {
        return this.research.members.includes(this.$currentUserName);
      },

      layoutSchema() {
        return defaultResearchTemplateSchema;
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
