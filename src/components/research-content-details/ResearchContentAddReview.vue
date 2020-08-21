<template>
  <d-layout-section>
    <research-content-add-review-body />

    <template #sidebar>
      <research-content-add-review-sidebar />
    </template>
  </d-layout-section>
</template>

<script>
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';

  export default {
    name: 'ResearchContentAddReview',
    components: { DLayoutSection },
    data() {
      return {};
    },

    created() {}
  };
</script>

<style lang="less" scoped>
</style>
