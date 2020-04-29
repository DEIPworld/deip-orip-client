<template>
  <base-page-layout>
    <v-card flat>
      <research-content-review-body />
    </v-card>

    <template #sidebar>
      <layout-sidebar right>
        <research-content-review-sidebar />
      </layout-sidebar>
    </template>
  </base-page-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import LayoutSidebar from '@/components/layout/components/LayoutSidebar';

  export default {
    name: 'ResearchContentReview',
    components: { LayoutSidebar },
    data() {
      return {};
    },
    computed: {},
    created() {},
    methods: {}
  };
</script>

<style lang="less" scoped>
</style>
