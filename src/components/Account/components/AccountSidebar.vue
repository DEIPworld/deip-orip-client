<template>
  <v-navigation-drawer
    :width="280"
    app
    clipped
    permanent
  >

    <template v-for="(menuBlock, menuIndex) of menu">
      <v-list :key="'menu-item-' + menuIndex" nav dense>
        <v-subheader>{{ menuBlock.subheader }}</v-subheader>
        <v-list-item
          v-for="(item, index) of menuBlock.items"
          :key="'menuItem-' + index"
          :to="item.route"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider v-if="menuIndex + 1 < menu.length" :key="'menu-' + menuIndex" />
    </template>
  </v-navigation-drawer>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'AccountSidebar',
    data() {
      return {
        menu: [
          {
            subheader: 'Projects',
            items: [
              {
                icon: 'next_week',
                title: 'Team\'s projects',
                route: { name: 'account.projects' }
              },
              {
                icon: 'business_center',
                title: 'My projects',
                route: { name: 'account.personalProjects' }
              },
              {
                icon: 'bookmarks',
                title: 'Following projects',
                route: { name: 'account.followingProjects' }
              }
              // {
              //   icon: 'mdi-file-replace',
              //   title: 'Project requests',
              //   route: { name: 'account.projectRequests' }
              // }
            ]
          },
          {
            subheader: 'Groups',
            items: [
              {
                icon: 'reduce_capacity',
                title: 'Teams',
                route: { name: 'account.groups' }
              }
            ]
          },
          {
            subheader: 'Security',
            items: [
              {
                icon: 'lock',
                title: 'Change password',
                route: { name: 'account.password' }
              },
              {
                icon: 'vpn_key',
                title: 'Private key',
                route: { name: 'account.privateKey' }
              }
            ]
          }
        ]
      };
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    }
  };
</script>

<style scoped>

</style>
