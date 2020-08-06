<template>
  <d-layout-section v-if="isPageLoaded">

    <research-application-details-package />

    <template #sidebar>
      <research-application-details-sidebar />
    </template>
  </d-layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';

  export default {
    name: 'ResearchApplicationDetails',
    components: { DLayoutSection },
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
