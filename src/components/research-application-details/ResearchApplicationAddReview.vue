<template>
  <base-page-layout :rightSidebarClass="'xs12 md3'" :contentClass="'xs12 md9'" v-if="isPageLoaded">
    <v-card slot="content" class="fill-height pa-5">
      <research-application-add-review-body></research-application-add-review-body>
    </v-card>

    <v-card slot="right-sidebar" class="fill-height py-5 px-4">
      <research-application-add-review-sidebar></research-application-add-review-sidebar>
    </v-card>
  </base-page-layout>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ResearchApplicationAddReview",
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      isLoadingResearchApplicationDetails:
        "rad/isLoadingResearchApplicationDetails"
    }),
    isPageLoaded() {
      return this.isLoadingResearchApplicationDetails === false;
    }
  }
};
</script>

<style lang="less" scoped>
</style>