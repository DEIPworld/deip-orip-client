<template>
  <v-sheet>
    <div class="global-loader-container">
      <global-loader />
    </div>

    <v-app-bar
      v-if="$ready"
      app
      fixed
      flat
      clipped-left
      clipped-right
      v-bind="themeSettings.appBar.bar"
    >
      <router-link :to="{ name: 'Default' }">
        <img height="40px" class="d-block" :src="portal | portalLogoSrc(80, 80, false)" />
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

      <user-notifications-list v-if="$isUser" />

      <v-menu
        v-if="$isUser"
        bottom
        left
        offset-y
        min-width="220"
      >
        <template #activator="{ on }">
          <v-btn icon v-on="on">
            <v-avatar size="32px" v-on="on">
              <v-img
                v-if="$currentUser.profile"
                :src="$currentUser.profile | avatarSrc(64, 64, false)"
              />
              <v-gravatar
                v-if="!$currentUser.profile && $currentUser.account"
                :title="$currentUser.username"
                :email="$currentUser.username + '@deip.world'"
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
        portal: 'auth/portal',
        themeSettings: 'layout/themeSettings',
        isGrantProgramOfficer: 'auth/isGrantProgramOfficer',
        isGrantFinanceOfficer: 'auth/isGrantFinanceOfficer',
        isUniversityCertifier: 'auth/isUniversityCertifier',
        isTreasuryCertifier: 'auth/isTreasuryCertifier',
        isGrantChiefOfficer: 'auth/isGrantChiefOfficer'
      }),
      isLoggedIn() { return accessService.isLoggedIn(); }, // $isUser

      mainMenu() {
        const routes = [];

        if (this.$isUser) {
          
          routes.push({
            label: this.$t('topMenu.explore'),
            to: { name: 'explore' }
          });

          if (this.$hasModule(this.DEIP_MODULE.APP_PAGE_ECI_OVERVIEW)) {
            routes.push({
              label: this.$t('topMenu.overview'),
              to: { name: 'overview' }
            });
          }

          if (this.$hasModule(this.DEIP_MODULE.APP_PAGE_ECI_PARTICIPIANTS)) {
            routes.push({
              label: this.$t('topMenu.participants'),
              to: { name: 'participants' }
            });
          }

          if (this.$hasModule(this.DEIP_MODULE.APP_GRANTS_MANAGEMENT)) {
            routes.push({
              label: this.$t('topMenu.dashboard'),
              to: { name: 'GrantProgramsAwardsDashboard' }
            });
          }

          if (this.$hasModule(this.DEIP_MODULE.APP_PAGE_ASSETS)) {
            routes.push({
              label: this.$t('topMenu.wallet'),
              to: { name: 'userWallet', params: { account: this.$currentUser.username } }
            });
          }

          if (this.$hasModule(this.DEIP_MODULE.APP_PAGE_MULTISIG_TRANSACTIONS)) {
            routes.push({
              label: this.$t('topMenu.transactions'),
              to: { name: 'transactions' }
            });
          }

        } else {

          routes.push({
            label: this.$t('topMenu.explore'),
            to: { name: 'explore' }
          });

          routes.push(            {
            label: this.$t('topMenu.signIn'),
            to: { name: this.$env.DEMO === 'GRANT-DISTRIBUTION-TRANSPARENCY' ? 'PortalSignIn' : 'SignIn' }
          });

          if (this.$hasModule(this.DEIP_MODULE.APP_PAGE_SIGN_UP)) {
            routes.push(            {
              label: this.$t('topMenu.signUp'),
              to: { name: 'SignUp' }
            });
          }

        }

        return routes;
      },

      userMenu() {

        const routes = [];

        routes.push({
          label: this.$t('topMenu.account'),
          icon: 'person',
          to: { name: 'account.summary' }
        });

        if (this.$hasModule(this.DEIP_MODULE.APP_BLOCKCHAIN_EXPLORER)) {
          routes.push({
            label: this.$t('topMenu.blockchainExplorer'),
            icon: 'link',
            href: this.$env.DEIP_CHAIN_EXPLORER_URL,
            target: '_blank'
          });
        }

        if (this.isGrantsTransparencyDemo) {
          routes.push(...[{
            label: this.$t('topMenu.createProject'),
            icon: 'mdi-clipboard-edit-outline',
            to: { name: 'project.create' }
          }, {
            label: this.$t('topMenu.grantPrograms'),
            icon: 'mdi-folder',
            to: { name: 'GrantPrograms' }
          }]);

          if (this.isGrantProgramOfficer) {
            routes.push({
              label: this.$t('topMenu.createGrantProgram'),
              icon: 'mdi-folder-edit-outline',
              to: { name: 'CreateGrantProgram' }
            })
          }
        }

        return routes;
      }
    },

    methods: {
      signOut() {
        accessService.clearAccessToken();
        this.$router.go('/sign-in');
      }
    },

    created() {
      this.$nextTick(() => {
        this.$setReady();
      });
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
