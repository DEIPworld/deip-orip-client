<template>
  <base-page-layout>
    <template #sidebar>
      <layout-sidebar right>
        <user-details-sidebar />
      </layout-sidebar>
    </template>
    <user-details-body />
  </base-page-layout>
</template>

<script>
  import LayoutSidebar from '@/components/layout/components/LayoutSidebar';

  export default {
    name: 'UserDetails',
    components: { LayoutSidebar },
    data() {
      return {};
    },
    created() {},
    methods: {}
  };
</script>

<style lang="less" scoped>
</style>
