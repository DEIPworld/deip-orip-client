<template>
  <layout-section>
    <claim-user-expertise-details-body />
    <template #sidebar>
      <claim-user-expertise-details-sidebar />
    </template>
  </layout-section>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'ClaimUserExpertiseDetails',
    components: { LayoutSection },
    data() {
      return {};
    },

    created() {},

    methods: {}
  };
</script>

<style lang="less" scoped>
</style>
