<template>
  <layout-section>
    <research-content-add-review-body />

    <template #sidebar>
      <research-content-add-review-sidebar />
    </template>

  </layout-section>
</template>

<script>
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'ResearchContentAddReview',
    components: { LayoutSection },
    data() {
      return {};
    },

    created() {}
  };
</script>

<style lang="less" scoped>
</style>
