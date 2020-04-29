<template>
  <base-page-layout :left-sidebar-class="'xs12 md3'" :content-class="'xs12 md9'">
    <v-card slot="left-sidebar" class="fill-height py-12 px-6">
      <claim-user-expertise-list-sidebar />
    </v-card>
    <v-card slot="content" class="fill-height pa-12">
      <claim-user-expertise-list-body />
    </v-card>
  </base-page-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import _ from 'lodash';

  export default {
    name: 'ClaimUserExpertiseList',

    created() {},

    methods: {}
  };
</script>

<style lang="less" scoped>
</style>
