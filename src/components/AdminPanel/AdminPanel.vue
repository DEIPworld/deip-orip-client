<template>
  <app-layout>
    <portal to="toolbar">
      <toolbar-admin
        v-if="!$route.meta.withoutHeader"
        :key="$route.fullPath + '-toolbar'"
      />
    </portal>

    <portal to="sidebar">
      <admin-sidebar />
    </portal>

    <router-view />
  </app-layout>
</template>

<script>
  import AppLayout from '@/components/layout/components/Layout';
  import ToolbarAdmin from '@/components/layout/components/ToolbarAdmin';
  import AdminSidebar from '@/components/AdminPanel/AdminSidebar';

  export default {
    name: 'AdminPanel',
    components: { AdminSidebar, ToolbarAdmin, AppLayout }
  };
</script>

<style lang="less" scoped>

</style>
