<template>
  <base-page-layout :rightSidebarClass="'xs12 md3'" :contentClass="'xs12 md9'">
    <v-card slot="content" class="fill-height pa-5">
      <research-content-review-body></research-content-review-body>
    </v-card>

    <v-card slot="right-sidebar" class="fill-height py-5 px-4">
      <research-content-review-sidebar></research-content-review-sidebar>
    </v-card>
  </base-page-layout>
</template>

<script>
import { mapGetters } from "vuex";
import deipRpc from "@deip/deip-oa-rpc-client";

export default {
  name: "ResearchContentReview",
  data() {
    return {};
  },
  computed: {},
  methods: {},
  created() {}
};
</script>

<style lang="less" scoped>
</style>