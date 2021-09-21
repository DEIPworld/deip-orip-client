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
            subheader: this.$t('account.sidebar.projectsBlock.title'),
            items: [
              {
                icon: 'next_week',
                title: this.$t('account.sidebar.projectsBlock.pr'),
                route: { name: 'account.teams.projects' }
              },
              // {
              //   icon: 'business_center',
              //   title: this.$t('account.sidebar.projectsBlock.myPr'),
              //   route: { name: 'account.personal.projects' }
              // },
              // {
              //   icon: 'bookmarks',
              //   title: this.$t('account.sidebar.projectsBlock.follPr'),
              //   route: { name: 'account.following.projects' }
              // }
            ]
          },
          {
            subheader: this.$t('account.sidebar.groupsBlock.title'),
            items: [
              {
                icon: 'reduce_capacity',
                title: this.$t('account.sidebar.groupsBlock.teams'),
                route: { name: 'account.groups' }
              }
            ]
          },
          {
            subheader: this.$t('account.sidebar.securityBlock.title'),
            items: [
              {
                icon: 'lock',
                title: this.$t('account.sidebar.securityBlock.password'),
                route: { name: 'account.password' }
              },
              {
                icon: 'vpn_key',
                title: this.$t('account.sidebar.securityBlock.privateKey'),
                route: { name: 'account.privateKey' }
              }
            ]
          }
        ]
      };
    }
  };
</script>

<style scoped>

</style>
