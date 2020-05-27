<template>
  <v-navigation-drawer
    app
    clipped
    permanent
    width="280"
  >
    <template>
      <v-list nav dense>
        <v-subheader>Account</v-subheader>
        <v-list-item :to="{ name: 'account.summary' }" exact>
          <v-list-item-avatar>
            <v-avatar>
              <img
                v-if="user.profile"
                :src="user.profile | avatarSrc(2 * 40, 2 * 40, false)"
              >
              <v-gravatar
                v-if="!user.profile && user.account"
                :title="user.username"
                :email="user.username + '@deip.world'"
              />
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ user.profile.firstName }}
              {{ user.profile.lastName }}
            </v-list-item-title>
            <v-list-item-subtitle class="caption">
              {{ user.profile.email }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon small :to="{ name: 'account.profile' }">
              <v-icon>edit</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider />
    </template>

    <template v-for="(menuBlock, menuIndex) of menu">
      <v-list nav dense :key="'menu-item-' + menuIndex">
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
                icon: 'mdi-file-document',
                title: 'Projects',
                route: { name: 'account.projects' }
              },
              {
                icon: 'mdi-file-replace',
                title: 'Project requests',
                route: { name: 'account.projectRequests' }
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
