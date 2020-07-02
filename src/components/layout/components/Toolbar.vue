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
      clipped-right
      v-bind="themeSettings.appBar.bar"
    >
      <router-link :to="{ name: 'Default' }">
        <img height="40px" class="d-block" :src="tenant.account | tenantLogoSrc(80, 80, false)">
      </router-link>

      <v-spacer />

      <v-tabs
        class="main-nav"
        v-bind="themeSettings.appBar.tabs"
        right
      >
        <v-tab
          v-for="(item, index) of mainMenu"
          :key="'nav-tab-' + index"
          :to="item.to"
        >
          {{ item.label }}
        </v-tab>
      </v-tabs>


      <user-notifications-list v-if="$isUser" />

      <v-menu
        v-if="$isUser"
        bottom
        left
        offset-y
        min-width="220"
      >
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
          <v-list-item
            v-for="(item, index) of userMenu"
            :key="'nav-tab-' + index"
            :to="item.to"
          >
            <v-list-item-icon>
              <v-icon v-if="item.icon">
                {{ item.icon }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              {{ item.label }}
            </v-list-item-title>
          </v-list-item>

          <v-divider />

          <v-list-item @click="signOut()">
            <v-list-item-icon>
              <v-icon>exit_to_app</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Sign Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
      isLoggedIn() { return accessService.isLoggedIn(); }, // $isUser
      isDefaultToolbar() {
        return !this.isGrantsTransparencyDemo;
      },

      mainMenu() {
        if (this.$isUser && !this.isGrantsTransparencyDemo) {
          return [
            {
              label: 'Explore',
              to: { name: 'ResearchFeed' }
            },
            {
              label: 'Dashboard',
              to: { name: 'Dashboard' }
            },
            {
              label: 'Overview',
              to: { name: 'overview' }
            },
            {
              label: 'Participants',
              to: { name: 'participants' }
            },
            // {
            //   label: 'Portfolio',
            //   to: { name: 'InvestorPortfolio' }
            // },
            // {
            //   label: 'Wallet',
            //   to: {
            //     name: 'UserWallet',
            //     params: { account_name: this.user.username }
            //   }
            // }
          ];
        }

        if (this.$isUser && this.isGrantsTransparencyDemo) {
          return [
            {
              label: 'Dashboard',
              to: {
                name: 'GrantProgramsAwardsDashboard',
                params: { agency: 'the-national-science-foundation' }
              }
            },
            {
              label: 'Wallet',
              to: {
                name: 'UserWallet',
                params: { account_name: this.user.username }
              }
            }
          ];
        }

        return [
          {
            label: 'Explore',
            to: { name: 'ResearchFeed' }
          },
          {
            label: 'Sign In',
            to: { name: this.$env.DEMO === 'GRANT-DISTRIBUTION-TRANSPARENCY' ? 'TenantSignIn' : 'SignIn' }
          },
          {
            label: 'Sign Up',
            to: { name: 'SignUp' }
          }
        ];
      },

      userMenu() {
        if (this.isGrantsTransparencyDemo) {
          return [
            {
              label: 'Profile',
              to: { name: 'UserDetails', params: { account_name: user.username } }
            },
            {
              label: 'Account Settings',
              to: { name: 'AccountSettings' }
            },
            {
              label: 'Create Grant Program',
              to: { name: 'CreateGrantProgram' }
            },
            {
              label: 'Grant Programs',
              to: { name: 'GrantPrograms', params: { agency: 'the-national-science-foundation' } }
            }
          ];
        }

        return [
          {
            label: 'Account',
            icon: 'person',
            to: { name: 'account.summary' }
          }
        ];
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

<style lang="scss" scoped>

  .main-nav {
    width: auto;
    flex: 0 0 auto;
  }

  .global-loader-container {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 201;
  }

</style>
