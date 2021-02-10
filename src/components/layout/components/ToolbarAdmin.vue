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
        <img height="40px" class="logo-image" :src="tenant | tenantLogoSrc(80, 80, false)">
      </router-link>

      <v-spacer />

      <user-notifications-list v-if="isLoggedIn" />

      <v-sheet v-if="isLoggedIn" color="transparent">
        <v-menu bottom left offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-avatar size="32px" v-on="on">
                <img
                  v-if="$currentUser.profile"
                  :src="$currentUser.profile | avatarSrc(64, 64, false)"
                >
                <v-gravatar
                  v-if="!$currentUser.profile && $currentUser.account"
                  :title="$currentUser.username"
                  :email="$currentUser.username + '@deip.world'"
                />
              </v-avatar>
            </v-btn>
          </template>

          <v-list
            dense
          >
            <v-list-item @click="signOut()">
              {{ $t('adminRouting.toolbarAdmin.signOut') }}
            </v-list-item>
          </v-list>

          <v-list
            v-if="isGrantsTransparencyDemo"
            dense
          >
            <v-list-item :to="{ name: 'UserDetails', params: { account_name: $currentUser.username } }">
              {{ $t('adminRouting.toolbarAdmin.profile') }}
            </v-list-item>
            <v-divider />
            <v-list-item :to="{ name: 'AccountSettings' }">
              {{ $t('adminRouting.toolbarAdmin.accSettings') }}
            </v-list-item>
            <v-list-item :to="{ name: 'CreateGrantProgram' }">
              {{ $t('adminRouting.toolbarAdmin.createGrantProgram') }}
            </v-list-item>
            <v-list-item :to="{ name: 'GrantPrograms' }">
              {{ $t('adminRouting.toolbarAdmin.grantProgram') }}
            </v-list-item>
            <v-divider />
            <v-list-item @click="signOut()">
              {{ $t('adminRouting.toolbarAdmin.signOut') }}
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
    name: 'ToolbarAdmin',
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
        tenant: 'auth/tenant',
        themeSettings: 'layout/themeSettings'
      }),
      isLoggedIn() { return accessService.isLoggedIn(); }
    },

    methods: {
      signOut() {
        accessService.clearAccessToken();
        this.$router.go('/sign-in');
      }
    }
  };
</script>
