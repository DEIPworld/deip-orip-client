<template>
  <base-page-layout :rightSidebarClass="'xs12 md3'" :contentClass="'xs12 md9'">
    <v-card slot="content" class="fill-height pa-5">
      <claim-user-expertise-details-body></claim-user-expertise-details-body>
    </v-card>

    <v-card slot="right-sidebar" class="fill-height py-5 px-4">
      <claim-user-expertise-details-sidebar></claim-user-expertise-details-sidebar>
    </v-card>
  </base-page-layout>
</template>

<script>
import deipRpc from "@deip/deip-oa-rpc-client";

export default {
  name: "ClaimUserExpertiseDetails",

  data() {
    return {};
  },

  methods: {},

  created() {}
};
</script>

<style lang="less" scoped>
</style>
