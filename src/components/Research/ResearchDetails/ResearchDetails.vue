<template>
  <research-details-renderer
    :schema="layoutSchema"
    :research="research"
  />
</template>

<script>
  import { researchDetailsSchema } from '@/components/Research/ResearchDetails/researchDetailsSchema';
  import { mapGetters } from 'vuex';
  import ResearchDetailsRenderer from '@/components/Research/ResearchDetails/ResearchDetailsRenderer';

  export default {
    name: 'ResearchDetails',
    components: { ResearchDetailsRenderer },
    computed: {
      ...mapGetters({
        research: 'Research/data'
      }),

      isOwner() {
        return this.research.members.includes(this.$currentUserName);
      },

      layoutSchema() {
        return researchDetailsSchema;
      }
    }
  };
</script>
