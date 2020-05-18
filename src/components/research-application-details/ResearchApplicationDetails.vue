<template>
  <layout-section v-if="isPageLoaded">

    <research-application-details-package />

    <template #sidebar>
      <research-application-details-sidebar />
    </template>
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'ResearchApplicationDetails',
    components: { LayoutSection },
    data() {
      return {};
    },
    computed: {
      ...mapGetters({
        isLoadingResearchApplicationDetails:
          'rad/isLoadingResearchApplicationDetails'
      }),
      isPageLoaded() {
        return this.isLoadingResearchApplicationDetails === false;
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
