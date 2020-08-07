<template>
  <v-navigation-drawer
    :width="280"
    app
    clipped
    permanent
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
</template>

<script>
  export default {
    name: 'AdminSidebar',
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
            title: 'Alternative review model',
            icon: 'rate_review',
            to: { name: 'admin.reviewModel' }
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

<style scoped>

</style>
