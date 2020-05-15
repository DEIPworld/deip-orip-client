<template>
  <layout-section v-if="isPageLoaded">
    <research-application-review-body />

    <template #sidebar>
      <research-application-review-sidebar />
    </template>
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'ResearchApplicationReview',
    components: { LayoutSection },
    data() {
      return {};
    },
    computed: {
      ...mapGetters({
        isLoadingResearchApplicationDetails: 'rad/isLoadingResearchApplicationDetails'
      }),
      isPageLoaded() {
        return this.isLoadingResearchApplicationDetails === false;
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
