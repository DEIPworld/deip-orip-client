<template>
  <d-layout-section>
    <d-layout-section-main>
      <research-content-review-body />
    </d-layout-section-main>

    <d-layout-section-sidebar>
      <research-content-review-sidebar />
    </d-layout-section-sidebar>
  </d-layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSectionSidebar from '@/components/Deipify/DLayout/DLayoutSectionSidebar';

  export default {
    name: 'ResearchContentReview',
    components: { DLayoutSectionSidebar, DLayoutSectionMain, DLayoutSection },
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
