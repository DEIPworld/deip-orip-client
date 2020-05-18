<template>
  <layout-section v-if="isPageLoaded">
    <research-application-add-review-body />

    <template #sidebar>
      <research-application-add-review-sidebar />
    </template>
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'ResearchApplicationAddReview',
    components: { LayoutSection },
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
