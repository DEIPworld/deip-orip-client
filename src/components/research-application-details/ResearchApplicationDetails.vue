<template>
  <base-page-layout :rightSidebarClass="'xs12 md3'" :contentClass="'xs12 md9'" v-if="isPageLoaded">
    <v-card slot="content" class="fill-height pa-5">
      <research-application-details-package></research-application-details-package>
    </v-card>

    <v-card slot="right-sidebar" class="fill-height py-5 px-4">
      <research-application-details-sidebar></research-application-details-sidebar>
    </v-card>
  </base-page-layout>
</template>

<script>
import { mapGetters } from "vuex";
import deipRpc from "@deip/deip-oa-rpc-client";

export default {
  name: "ResearchApplicationDetails",
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
