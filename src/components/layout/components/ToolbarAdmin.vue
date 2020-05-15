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
    name: 'ToolbarAdmin',

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
  };
</script>
