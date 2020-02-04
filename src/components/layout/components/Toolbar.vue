<template>
  <div class="toolbar-container">
    <div class="global-loader-container">
      <global-loader></global-loader>
    </div>

    <v-toolbar :color="themeSettings['top-bar-color']">
      <v-toolbar-side-icon class="mx-2 my-0">
        <router-link class="ma-0 pa-0" :to="{ name: 'Default' }">
          <img height="40px" :src="tenant | tenantLogoSrc(80, 80, false)" />
        </router-link>
      </v-toolbar-side-icon>

      <v-toolbar-title></v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items v-if="isLoggedIn()">
        <v-btn :to="{ name: 'ResearchFeed' }" :color="themeSettings['top-bar-link-color']" flat class="ma-0">Explore</v-btn>
        <!-- <v-btn :to="{ name: 'Dashboard' }" :color="themeSettings['top-bar-link-color']" flat class="ma-0">Dashboard</v-btn>
        <v-btn :to="{ name: 'InvestorDashboard' }" :color="themeSettings['top-bar-link-color']" flat class="ma-0">Portfolio</v-btn>
        <v-btn :to="{ name: 'UserWallet', params: { account_name: user.username } }" :color="themeSettings['top-bar-link-color']" flat class="ma-0">Wallet</v-btn> -->
        <user-notifications-list :notifications="user.notifications"></user-notifications-list>
        <v-menu bottom left offset-y>
          <v-btn fab flat icon class="ma-0" slot="activator">
            <v-avatar size="32px">
              <img v-if="user.profile" v-bind:src="user.profile.avatar | avatarSrc(2 * 32, 2 * 32, false)" />
              <v-gravatar v-if="!user.profile && user.account" :title="user.username" :email="user.username + '@deip.world'" />
            </v-avatar>
          </v-btn>
          <v-list class="dropdown-list" dark dense>
            <v-list-tile :to="{ name: 'UserDetails', params: { account_name: user.username } }">
              <v-list-tile-title>Profile</v-list-tile-title>
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
        <!-- <v-btn :color="themeSettings['top-bar-link-color']" flat :to="{ name: 'SignUp' }">Sign Up</v-btn> -->
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import { isLoggedIn, clearAccessToken } from './../../../utils/auth';
import { mapGetters } from 'vuex';

export default {
  name: 'Toolbar',
  data() {
    return {
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      tenant: 'auth/tenant',
      isGrantor: 'auth/isGrantor',
      isOfficer: 'auth/isOfficer',
      themeSettings: 'layout/themeSettings'
    })
  },

  methods: {
    isLoggedIn: isLoggedIn,

    signOut: function() {
      clearAccessToken()
      this.$router.go('/sign-in')
    }
  }
}
</script>

<style lang="less" scoped>

  .dropdown-list {
    min-width: 170px;
  }

  .toolbar-container {
    position: relative;
  }

  .global-loader-container {
    position: fixed;
    top: 0px;
    right: 0px;
    left: 0px;
    z-index: 201;
  }

</style>
