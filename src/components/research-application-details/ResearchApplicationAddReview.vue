<template>
  <d-layout-section v-if="isPageLoaded">
    <d-layout-section-main>
      <research-application-add-review-body />
    </d-layout-section-main>
    <d-layout-section-sidebar>
      <research-application-add-review-sidebar />
    </d-layout-section-sidebar>
  </d-layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSectionSidebar from '@/components/Deipify/DLayout/DLayoutSectionSidebar';

  export default {
    name: 'ResearchApplicationAddReview',
    components: { DLayoutSectionSidebar, DLayoutSectionMain, DLayoutSection },
    data() {
      return {};
    },
    computed: {
      ...mapGetters({
        isLoadingResearchApplicationDetails:
          'rad/isLoadingResearchApplicationDetails'
      }),
      isPageLoaded() {
        return this.isLoadingResearchApplicationDetails === false;
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
