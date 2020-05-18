<template>
  <layout-section>
    <research-content-review-body />

    <template #sidebar>
      <research-content-review-sidebar />
    </template>
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'ResearchContentReview',
    components: { LayoutSection },
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
