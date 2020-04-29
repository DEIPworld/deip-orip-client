<template>
  <base-page-layout>
    <template #header>
      <research-details-header />
    </template>

    <template #toolbar>
      <research-details-actions v-if="!isResearchGroupMember" />
    </template>

    <template #sidebar>
      <research-details-sidebar />
    </template>

    <research-details-body />
  </base-page-layout>
</template>

<script>
  import { mapGetters } from 'vuex';

  import ResearchDetailsActions from '@/components/research-details/components/ResearchDetailsActions';
  import ResearchDetailsBody from '@/components/research-details/components/ResearchDetailsBody';
  import ResearchDetailsHeader from '@/components/research-details/components/ResearchDetailsHeader';
  import ResearchDetailsSidebar from '@/components/research-details/components/ResearchDetailsSidebar';

  export default {
    name: 'ResearchDetails',
    components: {
      ResearchDetailsSidebar,
      ResearchDetailsHeader,
      ResearchDetailsBody,
      ResearchDetailsActions
    },
    computed: {
      ...mapGetters({
        research: 'rd/research'
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

<style scoped>
</style>
