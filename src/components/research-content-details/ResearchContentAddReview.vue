<template>
  <base-page-layout>
    <template #sidebar>
      <layout-sidebar right>
        <research-content-add-review-sidebar />
      </layout-sidebar>
    </template>

    <research-content-add-review-body />
  </base-page-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import LayoutSidebar from '@/components/layout/components/LayoutSidebar';

  export default {
    name: 'ResearchContentAddReview',
    components: { LayoutSidebar },
    data() {
      return {};
    },

    created() {}
  };
</script>

<style lang="less" scoped>
</style>
