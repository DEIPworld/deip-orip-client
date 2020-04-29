<template>
  <base-page-layout v-if="isPageLoaded" :right-sidebar-class="'xs12 md3'" :content-class="'xs12 md9'">
    <v-card slot="content" class="fill-height pa-12">
      <research-application-add-review-body />
    </v-card>

    <v-card slot="right-sidebar" class="fill-height py-12 px-6">
      <research-application-add-review-sidebar />
    </v-card>
  </base-page-layout>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'ResearchApplicationAddReview',
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
