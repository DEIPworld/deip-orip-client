<template>
  <base-page-layout>
    <template #sidebar>
      <research-group-details-sidebar />
    </template>

    <research-group-details-body />
  </base-page-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ResearchGroupDetailsSidebar from '@/components/research-group-details/components/ResearchGroupDetailsSidebar';
  import ResearchGroupDetailsBody from '@/components/research-group-details/components/ResearchGroupDetailsBody';

  export default {
    name: 'ResearchGroupDetails',
    components: { ResearchGroupDetailsBody, ResearchGroupDetailsSidebar },

    data() {
      return {};
    },
    computed: {},

    created() {
    }
  };
</script>

<style lang="less" scoped>
</style>
