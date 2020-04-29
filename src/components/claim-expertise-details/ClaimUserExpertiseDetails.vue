<template>
  <base-page-layout :right-sidebar-class="'xs12 md3'" :content-class="'xs12 md9'">
    <v-card slot="content" class="fill-height pa-12">
      <claim-user-expertise-details-body />
    </v-card>

    <v-card slot="right-sidebar" class="fill-height py-12 px-6">
      <claim-user-expertise-details-sidebar />
    </v-card>
  </base-page-layout>
</template>

<script>
  import deipRpc from '@deip/rpc-client';

  export default {
    name: 'ClaimUserExpertiseDetails',

    data() {
      return {};
    },

    created() {},

    methods: {}
  };
</script>

<style lang="less" scoped>
</style>
