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
        optional
      >
        <v-tab
          v-for="(item, index) of mainMenu"
          :key="'nav-tab-' + index"
          :to="item.to"
        >
          {{ item.label }}
        </v-tab>
      </v-tabs>

      <user-notifications-list v-if="$isLoggedIn" />

      <v-menu
        v-if="$isLoggedIn"
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
                :src="user.profile | avatarSrc(64, 64, false)"
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
          :dark="themeSettings.appBar.bar.dark"
          dense
        >
          <v-list-item
            v-for="(item, index) of userMenu"
            :key="'nav-tab-' + index"
            :href="item.href"
            :to="item.to"
            :target="item.target"
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
            <v-list-item-title>{{ $t('topMenu.signOut') }}</v-list-item-title>
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
        themeSettings: 'layout/themeSettings',
        isGrantProgramOfficer: 'auth/isGrantProgramOfficer',
        isGrantFinanceOfficer: 'auth/isGrantFinanceOfficer',
        isUniversityCertifier: 'auth/isUniversityCertifier',
        isTreasuryCertifier: 'auth/isTreasuryCertifier',
        isGrantChiefOfficer: 'auth/isGrantChiefOfficer'
      }),
      isLoggedIn() { return accessService.isLoggedIn(); }, // $isLoggedIn

      mainMenu() {
        if (this.$isLoggedIn && !this.isGrantsTransparencyDemo) {
          return [
            {
              label: this.$t('topMenu.explore'),
              to: { name: 'explore' }
            },
            // {
            //   label: this.$t('topMenu.dashboard'),
            //   to: { name: 'Dashboard' }
            // },
            {
              label: this.$t('topMenu.overview'),
              to: { name: 'overview' }
            },
            {
              label: this.$t('topMenu.participants'),
              to: { name: 'participants' }
            },
            // {
            //   label: this.$t('topMenu.portfolio'),
            //   to: { name: 'InvestorPortfolio' }
            // },
            {
              label: this.$t('topMenu.wallet'),
              to: {
                name: 'userWallet',
                params: { account: this.user.username }
              }
            },
            {
              label: this.$t('topMenu.transactions'),
              to: {
                name: 'transactions'
              }
            }
          ];
        }

        if (this.$isLoggedIn && this.isGrantsTransparencyDemo) {
          return [
            {
              label: this.$t('topMenu.explore'),
              to: { name: 'explore' }
            },
            {
              label: this.$t('topMenu.dashboard'),
              to: {
                name: 'GrantProgramsAwardsDashboard',
                params: { agency: '58e3bfd753fcb860a66b82635e43524b285ab708' }
              }
            },
            {
              label: this.$t('topMenu.wallet'),
              to: {
                name: 'userWallet',
                params: { account: this.user.username }
              }
            }
          ];
        }

        return [
          {
            label: this.$t('topMenu.explore'),
            to: { name: 'explore' }
          },
          {
            label: this.$t('topMenu.signIn'),
            to: { name: this.$env.DEMO === 'GRANT-DISTRIBUTION-TRANSPARENCY' ? 'TenantSignIn' : 'SignIn' }
          },
          {
            label: this.$t('topMenu.signUp'),
            to: { name: 'SignUp' }
          }
        ];
      },

      userMenu() {
        if (this.isGrantsTransparencyDemo) {

          const routes = [{
              label: this.$t('topMenu.account'),
              icon: 'person',
              to: { name: 'account.summary' }
            }, {
              label: this.$t('topMenu.createProject'),
              icon: 'mdi-clipboard-edit-outline',
              to: { name: 'project.create' }
            }, {
              label: this.$t('topMenu.grantPrograms'),
              icon: 'mdi-folder',
              to: { name: 'GrantPrograms', params: { agency: '58e3bfd753fcb860a66b82635e43524b285ab708' } }
            }
          ];

          if (this.isGrantProgramOfficer) {
            routes.push({
              label: this.$t('topMenu.createGrantProgram'),
              icon: 'mdi-folder-edit-outline',
              to: { name: 'CreateGrantProgram' }
            })
          }

          return routes;
        }

        return [
          {
            label: this.$t('topMenu.account'),
            icon: 'person',
            to: { name: 'account.summary' }
          },
          {
            label: this.$t('topMenu.blockchainExplorer'),
            icon: 'link',
            href: window.env.DEIP_CHAIN_EXPLORER_URL,
            target: '_blank'
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
