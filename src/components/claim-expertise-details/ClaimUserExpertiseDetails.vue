<template>
  <d-layout-section>
    <d-layout-section-main>
      <claim-user-expertise-details-body />
    </d-layout-section-main>
    <d-layout-section-sidebar>
      <claim-user-expertise-details-sidebar />
    </d-layout-section-sidebar>
  </d-layout-section>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSectionSidebar from '@/components/Deipify/DLayout/DLayoutSectionSidebar';

  export default {
    name: 'ClaimUserExpertiseDetails',
    components: { DLayoutSectionSidebar, DLayoutSectionMain, DLayoutSection },
    data() {
      return {};
    },

    created() {},

    methods: {}
  };
</script>

<style lang="less" scoped>
</style>
