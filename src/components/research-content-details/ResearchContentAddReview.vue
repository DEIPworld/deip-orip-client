<template>
  <d-layout-section>
    <d-layout-section-main>
      <research-content-add-review-body />
    </d-layout-section-main>
    <d-layout-section-sidebar>
      <research-content-add-review-sidebar />
    </d-layout-section-sidebar>
  </d-layout-section>
</template>

<script>
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSectionSidebar from '@/components/Deipify/DLayout/DLayoutSectionSidebar';

  export default {
    name: 'ResearchContentAddReview',
    components: { DLayoutSectionSidebar, DLayoutSectionMain, DLayoutSection },
    data() {
      return {};
    },

    created() {}
  };
</script>

<style lang="less" scoped>
</style>
