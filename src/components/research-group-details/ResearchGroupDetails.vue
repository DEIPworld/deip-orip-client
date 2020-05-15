<template>
  <layout-section>
    <research-group-details-body />

    <template #sidebar>
      <research-group-details-sidebar />
    </template>
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ResearchGroupDetailsSidebar from '@/components/research-group-details/components/ResearchGroupDetailsSidebar';
  import ResearchGroupDetailsBody from '@/components/research-group-details/components/ResearchGroupDetailsBody';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'ResearchGroupDetails',
    components: { LayoutSection, ResearchGroupDetailsBody, ResearchGroupDetailsSidebar },

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
