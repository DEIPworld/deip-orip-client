<template>
  <app-layout>
    <v-navigation-drawer app clipped permanent>
      <v-list
        nav
        dense
      >
        <v-list-item
          v-for="(item, index) of menu"
          :key="index"
          color="primary"
          :to="item.to"
          class="px-4"
        >
          <v-list-item-icon class="mr-6">
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

  export default {
    name: 'AdminPanel',
    components: { AppLayout },
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
    }
  };
</script>

<style lang="less" scoped>

</style>
