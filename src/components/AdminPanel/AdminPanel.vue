<template>
  <app-layout>

    <v-navigation-drawer app clipped permanent width="320">
      <v-list
        nav
        class="pa-6"
      >
        <v-list-item
          color="primary"
          v-for="(item, index) of menu"
          :key="index"
          :to="item.to"
        >
          <v-list-item-icon class="ml-2 mr-4">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          {{ item.label }}
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
            label: 'Members',
            icon: 'group',
            to: { name: 'admin.members' }
          },
          {
            label: 'Projects',
            icon: 'file_copy',
            to: { name: 'admin.projects' }
          },
          {
            label: 'Criteria',
            icon: 'extension',
            to: { name: 'admin.criteria' }
          },
          {
            label: 'FAQ',
            icon: 'forum',
            to: { name: 'admin.faq' }
          },
          {
            label: 'Settings',
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
