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

          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>

        </v-list-item-content>
        <v-chip
          v-if="item.badge"
          x-small
          color="warning"
          class="px-2 font-weight-medium"
        >
          {{ item.badge }}
        </v-chip>
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
            title: this.$t('adminRouting.sidebar.members'),
            icon: 'group',
            to: { name: 'admin.members' }
          },
          {
            title: this.$t('adminRouting.sidebar.projects'),
            icon: 'file_copy',
            to: { name: 'admin.projects' }
          },
          {
            title: this.$t('adminRouting.sidebar.criteria'),
            icon: 'extension',
            to: { name: 'admin.attributes' }
          },
          {
            title: this.$t('adminRouting.sidebar.categories'),
            icon: 'mdi-view-dashboard-outline',
            badge: 'pre-alpha',
            to: { name: 'admin.layouts' }
          },
          // TODO: remove categoryes code from all components
          // {
          //   title: 'Project categories',
          //   icon: 'category',
          //   to: { name: 'admin.categories' }
          // },
          {
            title: this.$t('adminRouting.sidebar.model'),
            icon: 'rate_review',
            to: { name: 'admin.reviewModel' }
          },
          {
            title: this.$t('adminRouting.sidebar.faq'),
            icon: 'forum',
            to: { name: 'admin.faq' }
          },
          {
            title: this.$t('adminRouting.sidebar.settings'),
            icon: 'settings',
            to: { name: 'admin.settings' }
          }
        ]
      };
    }
  };
</script>
