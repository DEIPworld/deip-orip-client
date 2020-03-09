<template>
  <base-page-layout :rightSidebarClass="'xs12 md3'" :contentClass="'xs12 md9'">
    <v-card slot="content" class="fill-height pa-5">
      <research-content-add-review-body></research-content-add-review-body>
    </v-card>

    <v-card slot="right-sidebar" class="fill-height py-5 px-4">
      <research-content-add-review-sidebar></research-content-add-review-sidebar>
    </v-card>
  </base-page-layout>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ResearchContentAddReview",

  data() {
    return {};
  },

  created() {}
};
</script>

<style lang="less" scoped>
</style>