<template>
  <v-sheet :dark="isDark">
    <div class="global-loader-container">
      <global-loader />
    </div>

    <v-app-bar
      app
      fixed
      flat
      hide-on-scroll
      clipped-left
      :color="themeSettings.topbar.backgroundColor"
      class="px-2"
    >
      <router-link :to="{ name: 'Default' }">
        <img height="40px" class="logo-image" :src="tenant | tenantLogoSrc(80, 80, false)">
      </router-link>

      <v-spacer />

      <v-tabs
        v-if="!isLoggedIn"
        class="main-nav"
        :color="themeSettings['top-bar-link-color']"
        right
      >
        <v-tab v-if="isDefaultToolbar" exact :to="{ name: 'ResearchFeed' }">
          Explore
        </v-tab>
        <!-- TODO: need refactoring -->
        <v-tab exact :to="{ name: env.DEMO === 'GRANT-DISTRIBUTION-TRANSPARENCY' ? 'TenantSignIn' : 'SignIn' }">
          Sign In
        </v-tab>
        <v-tab exact :to="{ name: 'SignUp' }">
          Sign Up
        </v-tab>
      </v-tabs>

      <v-tabs
        v-if="isLoggedIn && isDefaultToolbar"
        class="main-nav ml-a"
        :color="themeSettings['top-bar-link-color']"
        right
      >
        <v-tab exact :to="{ name: 'ResearchFeed' }">
          Explore
        </v-tab>
        <v-tab exact :to="{ name: 'Dashboard' }">
          Dashboard
        </v-tab>
        <v-tab exact :to="{ name: 'InvestorPortfolio' }">
          Portfolio
        </v-tab>
        <v-tab exact :to="{ name: 'UserWallet', params: { account_name: user.username } }">
          Wallet
        </v-tab>
      </v-tabs>

      <v-tabs
        v-if="isLoggedIn && isGrantsTransparencyDemo"
        class="main-nav"
        :color="themeSettings['top-bar-link-color']"
        right
      >
        <v-tab exact :to="{ name: 'GrantProgramsAwardsDashboard', params: { agency: 'nsf' } }">
          Dashboard
        </v-tab>
        <v-tab exact :to="{ name: 'UserWallet', params: { account_name: user.username } }">
          Wallet
        </v-tab>
      </v-tabs>


      <user-notifications-list v-if="isLoggedIn" :notifications="user.notifications" />
      <v-sheet v-if="isLoggedIn" color="transparent">
        <v-menu bottom left offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-avatar size="32px" v-on="on">
                <img
                  v-if="user.profile"
                  :src="user.profile | avatarSrc(2 * 32, 2 * 32, false)"
                >
                <v-gravatar
                  v-if="!user.profile && user.account"
                  :title="user.username"
                  :email="user.username + '@deip.world'"
                />
              </v-avatar>
            </v-btn>
          </template>

          <v-list
            v-if="isDefaultToolbar"
            :dark="themeSettings['dark']"
            :light="themeSettings['light']"
            dense
          >
            <v-list-item :to="{ name: 'UserDetails', params: { account_name: user.username } }">
              Profile
            </v-list-item>
            <v-divider />
            <v-list-item :to="{ name: 'AccountSettings' }">
              Account Settings
            </v-list-item>
            <v-divider />
            <v-list-item @click="signOut()">
              Sign Out
            </v-list-item>
          </v-list>

          <v-list
            v-if="isGrantsTransparencyDemo"
            :dark="themeSettings['dark']"
            :light="themeSettings['light']"
            dense
          >
            <v-list-item :to="{ name: 'UserDetails', params: { account_name: user.username } }">
              Profile
            </v-list-item>
            <v-divider />
            <v-list-item :to="{ name: 'AccountSettings' }">
              Account Settings
            </v-list-item>
            <v-list-item :to="{ name: 'CreateGrantProgram' }">
              Create Grant Program
            </v-list-item>
            <v-list-item :to="{ name: 'GrantPrograms', params: { agency: 'nsf' } }">
              Grant Programs
            </v-list-item>
            <v-divider />
            <v-list-item @click="signOut()">
              Sign Out
            </v-list-item>
          </v-list>
        </v-menu>
      </v-sheet>
    </v-app-bar>
  </v-sheet>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { AccessService } from '@deip/access-service';
  import { AppConfigService } from '@deip/app-config-service';

  const accessService = AccessService.getInstance();
  const appConfigService = AppConfigService.getInstance();

  export default {
    name: 'Toolbar',

    props: {
      isGrantsTransparencyDemo: {
        type: Boolean,
        required: false,
        default: false
      }
    },

    data() {
      return {
        env: appConfigService.get('env')
      };
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        tenant: 'auth/tenant',
        themeSettings: 'layout/themeSettings'
      }),
      isDark() {
        return !this.themeSettings.topbar.light;
      },
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

    // mounted() {
    //   const initial = this.$refs.mainNav.offsetWidth;
    //   const interval = setInterval(() => {
    //     if (this.$refs.mainNav) {
    //       if (this.$refs.mainNav.offsetWidth !== initial) {
    //         clearInterval(interval)
    //         this.$refs.mainNav.callSlider();
    //       }
    //     }
    //   }, 1000);
    // }
  };
</script>

<style lang="less" scoped>

  .main-nav {
    width: auto;
    flex: 0 0 auto;
  }

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
