<template>
  <v-sheet>
    <div class="global-loader-container">
      <global-loader />
    </div>

    <v-app-bar
      app
      fixed
      flat
      clipped-left
      v-bind="themeSettings.appBar.bar"
    >
      <router-link :to="{ name: 'Default' }">
        <img height="40px" class="logo-image" :src="tenant.account | tenantLogoSrc(80, 80, false)">
      </router-link>

      <v-spacer />

      <v-tabs
        v-if="!isLoggedIn"
        class="main-nav"
        v-bind="themeSettings.appBar.tabs"
        right
      >
        <v-tab v-if="isDefaultToolbar" exact :to="{ name: 'ResearchFeed' }">
          Explore
        </v-tab>
        <!-- TODO: need refactoring -->
        <v-tab exact :to="{ name: $env.DEMO === 'GRANT-DISTRIBUTION-TRANSPARENCY' ? 'TenantSignIn' : 'SignIn' }">
          Sign In
        </v-tab>
        <v-tab exact :to="{ name: 'SignUp' }">
          Sign Up
        </v-tab>
      </v-tabs>

      <v-tabs
        v-if="isLoggedIn && isDefaultToolbar"
        class="main-nav ml-a"
        v-bind="themeSettings.appBar.tabs"
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
        v-bind="themeSettings.appBar.tabs"
        right
      >
        <v-tab exact :to="{ name: 'GrantProgramsAwardsDashboard', params: { agency: 'the-national-science-foundation' } }">
          Dashboard
        </v-tab>
        <v-tab exact :to="{ name: 'UserWallet', params: { account_name: user.username } }">
          Wallet
        </v-tab>
      </v-tabs>


      <user-notifications-list v-if="isLoggedIn" />

      <v-sheet v-if="isLoggedIn" color="transparent">
        <v-menu bottom left offset-y min-width="220">
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
            :dark="themeSettings.appBar.bar.dark"
            dense
          >
<!--            <v-list-item :to="{ name: 'UserDetails', params: { account_name: user.username } }">-->
<!--              Profile-->
<!--            </v-list-item>-->
<!--            <v-divider />-->

            <v-list-item :to="{ name: 'account.summary' }">
              <v-list-item-icon>
                <v-icon>person</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Account</v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-list-item @click="signOut()">
              <v-list-item-icon>
                <v-icon>exit_to_app</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sign Out</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-list
            v-if="isGrantsTransparencyDemo"
            :dark="themeSettings.appBar.bar.dark"
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
            <v-list-item :to="{ name: 'GrantPrograms', params: { agency: 'the-national-science-foundation' } }">
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
  import UserNotificationsList from '@/components/layout/components/user-notificatons-list/UserNotificationsList';

  const accessService = AccessService.getInstance();

  export default {
    name: 'Toolbar',
    components: { UserNotificationsList },
    props: {
      isGrantsTransparencyDemo: {
        type: Boolean,
        required: false,
        default: false
      }
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
