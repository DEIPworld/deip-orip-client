<template>
  <d-layout-section>
    <claim-user-expertise-details-body />
    <template #sidebar>
      <claim-user-expertise-details-sidebar />
    </template>
  </d-layout-section>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';

  export default {
    name: 'ClaimUserExpertiseDetails',
    components: { DLayoutSection },
    data() {
      return {};
    },

    created() {},

    methods: {}
  };
</script>

<style lang="less" scoped>
</style>
