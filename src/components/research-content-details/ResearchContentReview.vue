<template>
  <d-layout-section>
    <research-content-review-body />

    <template #sidebar>
      <research-content-review-sidebar />
    </template>
  </d-layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';

  export default {
    name: 'ResearchContentReview',
    components: { DLayoutSection },
    data() {
      return {};
    },
    computed: {},
    created() {},
    methods: {}
  };
</script>

<style lang="less" scoped>
</style>
