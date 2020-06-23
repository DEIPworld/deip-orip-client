<template>
  <app-layout>

    <portal to="toolbar">
      <toolbar-admin
        v-if="!$route.meta.withoutHeader"
        :key="$route.fullPath + '-toolbar'"
      />
    </portal>

    <v-navigation-drawer
      app
      clipped
      permanent
      width="280"
    >
      <v-list
        nav
        dense
      >
        <v-list-item
          v-for="(item, index) of menu"
          :key="index"
          color="primary"
          :to="item.to"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <router-view />
  </app-layout>
</template>

<script>
  import AppLayout from '@/components/layout/components/Layout';
  import ToolbarAdmin from '@/components/layout/components/ToolbarAdmin';

  export default {
    name: 'AdminPanel',
    components: { ToolbarAdmin, AppLayout },
    data() {
      return {
        menu: [
          {
            title: 'Members',
            icon: 'group',
            to: { name: 'admin.members' }
          },
          {
            title: 'Projects',
            icon: 'file_copy',
            to: { name: 'admin.projects' }
          },
          {
            title: 'Criteria',
            icon: 'extension',
            to: { name: 'admin.criteria' }
          },
          {
            title: 'Project categories',
            icon: 'category',
            to: { name: 'admin.categories' }
          },
          {
            title: 'FAQ',
            icon: 'forum',
            to: { name: 'admin.faq' }
          },
          {
            title: 'Settings',
            icon: 'settings',
            to: { name: 'admin.settings' }
          }
        ]
      };
    },
    // $dataPreload() {
    //   return this.$store.dispatch('adminPanel/loadAdminPanel', {})
    // }
  };
</script>

<style lang="less" scoped>

</style>
