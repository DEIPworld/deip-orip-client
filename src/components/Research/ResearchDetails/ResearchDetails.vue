<template>
  <research-details-renderer
    :schema="layoutSchema"
    :research="research"
  />
</template>

<script>
  import { defaultResearchTemplateSchema } from '@/components/Research/ResearchDetails/ResearchDetailsDefaults/defaultLayoutSchema';
  import { mapGetters } from 'vuex';
  import ResearchDetailsRenderer from '@/components/Research/ResearchDetails/ResearchDetailsRenderer';

  export default {
    name: 'ResearchDetails',
    components: { ResearchDetailsRenderer },
    data() {
      return {
        defaultResearchTemplateSchema
      };
    },
    computed: {
      ...mapGetters({
        research: 'Research/data'
      }),

      isOwner() {
        return this.research.members.includes(this.$currentUserName);
      },

      layoutSchema() {
        return defaultResearchTemplateSchema;
      }
    }
  };
</script>
