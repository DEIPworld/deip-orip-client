<template>
  <div class="toolbar-container">
    <div class="global-loader-container">
      <global-loader></global-loader>
    </div>

    <v-toolbar v-if="isDefaultToolbar" :color="themeSettings['top-bar-color']" :class="themeSettings['top-bar-class']">
      <router-link class="ma-0 pa-0" :to="{ name: 'Default' }">
        <img height="40px" class="logo-image" :src="tenant | tenantLogoSrc(80, 80, false)" />
      </router-link>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="isLoggedIn">
        <v-btn :to="{ name: 'ResearchFeed' }" :color="themeSettings['top-bar-link-color']" flat class="ma-0">
          Explore
        </v-btn>
        <v-btn :to="{ name: 'Dashboard' }" :color="themeSettings['top-bar-link-color']" flat class="ma-0">
          Dashboard
        </v-btn>
        <v-btn :to="{ name: 'InvestorPortfolio' }" :color="themeSettings['top-bar-link-color']" flat class="ma-0">
          Portfolio
        </v-btn>
        <v-btn :to="{ name: 'UserWallet', params: { account_name: user.username } }" :color="themeSettings['top-bar-link-color']" flat class="ma-0">
          Wallet
        </v-btn>
        <user-notifications-list :notifications="user.notifications"></user-notifications-list>
        <v-menu bottom left offset-y>
          <v-btn fab flat icon class="ma-0" slot="activator">
            <v-avatar size="32px">
              <img v-if="user.profile" v-bind:src="user.profile | avatarSrc(2 * 32, 2 * 32, false)" />
              <v-gravatar v-if="!user.profile && user.account" :title="user.username" :email="user.username + '@deip.world'" />
            </v-avatar>
          </v-btn>
          <v-list class="dropdown-list" :dark="themeSettings['dark']" :light="themeSettings['light']" dense>
            <v-list-tile :to="{ name: 'UserDetails', params: { account_name: user.username } }">
              <v-list-tile-title>Profile</v-list-tile-title>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile :to="{ name: 'AccountSettings' }">
              <v-list-tile-title>Account Settings</v-list-tile-title>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile @click="signOut()">
              <v-list-tile-title>Sign Out</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>

      <v-toolbar-items v-else>
        <v-btn :to="{ name: 'ResearchFeed' }" :color="themeSettings['top-bar-link-color']" flat class="ma-0">Explore</v-btn>
        <v-btn :color="themeSettings['top-bar-link-color']" flat :to="{ name: 'SignIn' }">Sign In</v-btn>
        <v-btn :color="themeSettings['top-bar-link-color']" flat :to="{ name: 'SignUp' }">Sign Up</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-toolbar v-if="isGrantsTransparencyDemo" :color="themeSettings['top-bar-color']" :class="themeSettings['top-bar-class']">
      <router-link class="ma-0 pa-0" :to="{ name: 'Default' }">
        <img height="40px" class="logo-image" :src="tenant | tenantLogoSrc(80, 80, false)" />
      </router-link>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="isLoggedIn">
        <v-btn :to="{ name: 'GrantProgramsAwardsDashboard', params: { agency: 'nsf' } }" :color="themeSettings['top-bar-link-color']" flat class="ma-0">
          Dashboard
        </v-btn>
        <v-btn :to="{ name: 'UserWallet', params: { account_name: user.username } }" :color="themeSettings['top-bar-link-color']" flat class="ma-0">
          Wallet
        </v-btn>
        <user-notifications-list :notifications="user.notifications"></user-notifications-list>
        <v-menu bottom left offset-y>
          <v-btn fab flat icon class="ma-0" slot="activator">
            <v-avatar size="32px">
              <img v-if="user.profile" v-bind:src="user.profile | avatarSrc(2 * 32, 2 * 32, false)" />
              <v-gravatar v-if="!user.profile && user.account" :title="user.username" :email="user.username + '@deip.world'" />
            </v-avatar>
          </v-btn>
          <v-list class="dropdown-list" :dark="themeSettings['dark']" :light="themeSettings['light']" dense>
            <v-list-tile :to="{ name: 'UserDetails', params: { account_name: user.username } }">
              <v-list-tile-title>Profile</v-list-tile-title>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile :to="{ name: 'AccountSettings' }">
              <v-list-tile-title>Account Settings</v-list-tile-title>
            </v-list-tile>
            <v-list-tile :to="{ name: 'CreateGrantProgram' }">
              <v-list-tile-title>Create Grant Program</v-list-tile-title>
            </v-list-tile>
            <v-list-tile :to="{ name: 'GrantPrograms', params: { agency: 'nsf' } }">
              <v-list-tile-title>Grant Programs</v-list-tile-title>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile @click="signOut()">
              <v-list-tile-title>Sign Out</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>

      <v-toolbar-items v-else>
        <v-btn :color="themeSettings['top-bar-link-color']" flat :to="{ name: 'SignIn' }">Sign In</v-btn>
        <v-btn :color="themeSettings['top-bar-link-color']" flat :to="{ name: 'SignUp' }">Sign Up</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <div v-if="themeSettings['top-bar-divider-color']">
      <v-divider style="padding: 0.5px 0px 0.5px 0px" :color="themeSettings['top-bar-divider-color']"></v-divider>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { AccessService } from '@deip/access-service';

  const accessService = AccessService.getInstance();

  export default {
    name: 'Toolbar',

    props: {
      isGrantsTransparencyDemo: { type: Boolean, required: false, default: false }
    },

    data() {
      return {}
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        tenant: 'auth/tenant',
        themeSettings: 'layout/themeSettings'
      }),
      isLoggedIn() { return accessService.isLoggedIn(); },
      isDefaultToolbar() {
        return !this.isGrantsTransparencyDemo;
      }
    },

    methods: {
      signOut() {
        accessService.clearAccessToken();
        this.$router.go('/sign-in');
      }
    }
  };
</script>

<style lang="less" scoped>

  .logo-image {
    display: block;
  }

  .dropdown-list {
    min-width: 170px;
  }

  .toolbar-container {
    position: relative;
  }

  .global-loader-container {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 201;
  }

</style>
