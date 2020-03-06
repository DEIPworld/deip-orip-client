<template>
  <base-page-layout>
    <research-group-details-body slot="content"></research-group-details-body>
    <research-group-details-sidebar slot="right-sidebar"></research-group-details-sidebar>
  </base-page-layout>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'ResearchGroupDetails',

    computed: {},

    data() {
      return {};
    },

    created() {
    }
  };
</script>

<style lang="less" scoped>
</style>
