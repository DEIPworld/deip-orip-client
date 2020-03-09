<template>
  <base-page-layout :leftSidebarClass="'xs12 md3'" :contentClass="'xs12 md9'">
    <v-card slot="left-sidebar" class="fill-height py-5 px-4">
      <claim-user-expertise-list-sidebar></claim-user-expertise-list-sidebar>
    </v-card>
    <v-card slot="content" class="fill-height pa-5">
      <claim-user-expertise-list-body></claim-user-expertise-list-body>
    </v-card>
  </base-page-layout>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash";

export default {
  name: "ClaimUserExpertiseList",

  methods: {},

  created() {}
};
</script>

<style lang="less" scoped>
</style>
