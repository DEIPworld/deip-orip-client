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
      };
    },
    computed: {
      menu() {
        const menu = [];

        if (this.$hasModule(this.DEIP_MODULE.ADMIN_PANEL_MEMBERS_MANAGEMENT)) {
          menu.push({
            title: this.$t('adminRouting.sidebar.members'),
            icon: 'group',
            to: { name: 'admin.members' }
          });
        }

        if (this.$hasModule(this.DEIP_MODULE.ADMIN_PANEL_PROJECTS_MANAGEMENT)) {
          menu.push({
            title: this.$t('adminRouting.sidebar.projects'),
            icon: 'file_copy',
            to: { name: 'admin.projects' }
          });
        }

        if (this.$hasModule(this.DEIP_MODULE.ADMIN_PANEL_ATTRIBUTES_MANAGEMENT)) {
          menu.push({
            title: this.$t('adminRouting.sidebar.criteria'),
            icon: 'extension',
            to: { name: 'admin.attributes' }
          });
        }

        if (this.$hasModule(this.DEIP_MODULE.ADMIN_PANEL_LAYOUTS_SETUP)) {
          menu.push({
            title: this.$t('adminRouting.sidebar.layouts'),
            icon: 'mdi-view-dashboard-outline',
            badge: 'pre-alpha',
            to: { name: 'admin.layouts' }
          });
        }

        if (this.$hasModule(this.DEIP_MODULE.ADMIN_PANEL_REVIEW_SETUP)) {
          menu.push({
            title: this.$t('adminRouting.sidebar.reviewModel'),
            icon: 'rate_review',
            to: { name: 'admin.reviewModel' }
          });
        }

        if (this.$hasModule(this.DEIP_MODULE.ADMIN_PANEL_FAQ_SETUP)) {
          menu.push({
            title: this.$t('adminRouting.sidebar.faq'),
            icon: 'forum',
            to: { name: 'admin.faq' }
          });
        }

        menu.push({
          title: this.$t('adminRouting.sidebar.settings'),
          icon: 'settings',
          to: { name: 'admin.settings' }
        });

        return menu;
      }
    }
  };
</script>
